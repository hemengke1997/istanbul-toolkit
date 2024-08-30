/*
 Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import { $ } from 'execa'
import { type Request, type Response } from 'express'
import fg from 'fast-glob'
import fs from 'fs-extra'
import { type CoverageMap, createCoverageMap } from 'istanbul-lib-coverage'
import * as _ from 'lodash-es'
import path from 'node:path'
import * as querystring from 'node:querystring'
import { parse } from 'node-html-parser'

export type CoveragePath = {
  ns: string
  v: string
}

export class Coverage {
  static coverage: any = {}
  static TEMP_DIR = `${process.cwd()}/.nyc_output`
  static REPORT_DIR = `${process.cwd()}/coverage`
  static init() {
    const files = fg.sync(`${Coverage.TEMP_DIR}/**/*.json`, {
      cwd: process.cwd(),
      onlyFiles: true,
      dot: true,
      absolute: false,
    })
    files.forEach((f) => {
      const regex = /\/\.nyc_output(\/.*\/).*\.json$/
      const match = f.match(regex)?.[1]
      if (match) {
        const coveragePath = match.split('/').filter(Boolean)
        Coverage.set({ ns: coveragePath[0], v: coveragePath[1] }, [], fs.readJSONSync(f))
      }
    })
  }
  static get(path?: CoveragePath) {
    this.coverage = this.coverage || {}
    const keys = path ? [path.ns, path.v] : []
    return _.get(this.coverage, keys) || {}
  }
  static set(path: CoveragePath, extraPath: string | string[], value: any) {
    extraPath = _.isArray(extraPath) ? extraPath : [extraPath]
    const keys = [path.ns, path.v, ...(extraPath || [])].filter(Boolean)
    this.coverage = _.set(this.coverage, keys, value)
  }
  static clearAssets() {
    fs.rm(this.TEMP_DIR, { recursive: true })
    fs.rm(this.REPORT_DIR, { recursive: true })
  }
}

export function render(req: Request, res: Response, coveragePath: CoveragePath) {
  const coverage = Coverage.get(coveragePath)

  if (!(coverage && Object.keys(coverage).length > 0)) {
    res.setHeader('Content-type', 'text/plain')
    return res.end('No coverage information has been collected')
  }

  const coverageRenderResult = createCoverage(coveragePath)

  const indexHtmlPath = `${process.cwd()}/coverage/${coveragePath.ns}/${coveragePath.v}/index.html`

  if (!fs.existsSync(indexHtmlPath)) {
    return res.json({ res: coverageRenderResult })
  }

  const index = fs.readFileSync(indexHtmlPath, 'utf-8')

  const indexHtml = parse(index)

  indexHtml
    .querySelector('.pad1')
    ?.appendChild(
      parse(
        `<button type="submit" id="btnDownload" style="margin-bottom: 16px;" onclick="window.open('${req.baseUrl}/download?v=${coveragePath.v}')">Download report</button>`,
      ),
    )

  fs.writeFileSync(indexHtmlPath, indexHtml.toString())

  res.setHeader('Content-type', 'text/html')

  const queryString = querystring.stringify(req.query as querystring.ParsedUrlQueryInput)

  res.redirect(`public/${coveragePath.ns}/${coveragePath.v}?${queryString}`)

  res.end()
}

export function createCoverage(coveragePath: CoveragePath) {
  const dir = path.join(Coverage.TEMP_DIR, coveragePath.ns, coveragePath.v)
  const reportDir = path.join(Coverage.REPORT_DIR, coveragePath.ns, coveragePath.v)
  const coverage = Coverage.get(coveragePath)

  fs.ensureDirSync(dir)
  fs.ensureDirSync(reportDir)

  fs.writeFileSync(path.join(dir, 'out.json'), JSON.stringify(coverage))

  const res = $.sync`nyc report --reporter=html --reporter=cobertura --tempDirectory=${dir} --reportDir=${reportDir} --excludeAfterRemap=false`

  return res
}

export function mergeClientCoverage(coverageObj: any, coveragePath: CoveragePath) {
  if (!coverageObj || !coveragePath) {
    return
  }

  const original = Coverage.get(coveragePath)
  const added = coverageObj

  const result: CoverageMap = createCoverageMap(original || {})
  result.merge(added)

  Coverage.set(coveragePath, '', result)
}

export function resetCoverageObject(coveragePath?: CoveragePath) {
  if (_.isEmpty(coveragePath)) {
    global.__coverage__ = {}
    Coverage.clearAssets()
  } else {
    const { ns, v } = coveragePath
    if (ns) {
      if (v) {
        _.set(global.__coverage__, [ns, v], {})
      } else {
        _.set(global.__coverage__, [ns], {})
      }
    }
  }
}
