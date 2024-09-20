/*
 Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import bodyParser from 'body-parser'
import express, { type NextFunction, type Request, type Response } from 'express'
import fs from 'fs-extra'
import path from 'node:path'
import url from 'node:url'
import * as core from './core'
import { writeZip } from './zip-writer'

/**
 * Set default max limit to 100mb for incoming JSON and urlencoded
 */
const fileSizeMaximum = '100mb'

class Router {
  static getNS(req: Request) {
    return req.baseUrl.split('/')[1]
  }

  static getQuery(req: Request): { p: string; v: string } {
    const { query } = req
    return {
      p: query.p as string, // path
      v: query.v as string, // git commit verison
    }
  }

  static validateQuery(req: Request, res: Response, next: NextFunction) {
    const query = Router.getQuery(req)
    const { v } = query
    if (!v) {
      res.setHeader('Content-type', 'text/plain')
      return res.end(`[v] parameter must be specified`)
    }
    next()
  }
}

let timer: NodeJS.Timeout

export function createHandler(opts?: { resetOnGet: boolean }) {
  const { resetOnGet } = opts || {}
  const app = express()
  // using separete options objects to maintain readability as the objects are getting more complex
  const urlOptions = { extended: true, limit: fileSizeMaximum }
  const jsonOptions = { limit: fileSizeMaximum }

  app.use('/public', express.static(path.join(process.cwd(), 'coverage')))

  app.use(bodyParser.urlencoded(urlOptions))
  app.use(bodyParser.json(jsonOptions))

  //show main page for coverage report for /
  app.get('/', Router.validateQuery, (req, res) => {
    let origUrl = url.parse(req.originalUrl).pathname || ''
    const origLength = origUrl.length
    if (origUrl.charAt(origLength - 1) !== '/') {
      origUrl += '/'
    }
    core.render(req, res, {
      ns: Router.getNS(req),
      v: Router.getQuery(req).v,
    })
  })

  //show page for specific file/ dir for /show?p=/path/to/file
  app.get('/show', Router.validateQuery, (req, res) => {
    let origUrl = url.parse(req.originalUrl).pathname!
    const u = url.parse(req.url).pathname!
    const pos = origUrl.indexOf(u)
    const file = req.query.p
    if (pos >= 0) {
      origUrl = origUrl.substring(0, pos)
    }
    if (!file) {
      res.setHeader('Content-type', 'text/plain')
      return res.end('[p] parameter must be specified')
    }
    core.render(req, res, {
      ns: Router.getNS(req),
      v: Router.getQuery(req).v,
    })
  })

  //reset coverage to baseline on POST /reset
  app.post('/reset', (req, res) => {
    core.resetCoverageObject({
      ns: Router.getNS(req),
      v: Router.getQuery(req).v,
    })
    res.json({ ok: true })
  })

  app.post('/reset/all', (_, res) => {
    core.resetCoverageObject()
    res.json({ ok: true })
  })

  //opt-in to allow resets on GET as well (useful for easy browser-based demos :)
  if (resetOnGet) {
    app.get('/reset', (req, res) => {
      core.resetCoverageObject({
        ns: Router.getNS(req),
        v: Router.getQuery(req).v,
      })
      res.json({ ok: true })
    })
    app.get('/reset/all', (_, res) => {
      core.resetCoverageObject()
      res.json({ ok: true })
    })
  }

  //return global coverage object on /object as JSON
  app.get('/object', Router.validateQuery, (req, res) => {
    res.json(core.Coverage.get({ ns: Router.getNS(req), v: Router.getQuery(req).v }))
  })

  //send self-contained download package with coverage and reports on /download
  app.get('/download', Router.validateQuery, async (req, res) => {
    try {
      const p = { ns: Router.getNS(req), v: Router.getQuery(req).v }
      core.createCoverage(p)

      const zipDir = path.join(process.cwd(), '.assets')
      const zipFileName = `${p.ns}-${p.v}-coverage.zip`
      const zipName = path.join(zipDir, zipFileName)
      if (fs.existsSync(zipName)) {
        fs.rmSync(zipName, { recursive: true })
      }

      await writeZip(zipName, p)
      res.statusCode = 200
      res.setHeader('Content-type', 'application/zip')
      res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`)
      const filestream = fs.createReadStream(zipName)
      filestream.pipe(res)
      filestream.on('end', () => {
        fs.rmSync(zipName, { recursive: true })
      })
    } catch {
      res.statusCode = 404
    }
  })

  //merge client coverage posted from browser
  app.post('/client', (req, res) => {
    const body = req.body
    if (!(body && typeof body === 'object')) {
      //probably needs to be more robust
      return res.status(400).send('Please post an object with content-type: application/json')
    }

    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(
      () => {
        core.Coverage.clearAssets()
      },
      60 * 60 * 24 * 1000, // 24小时清除
    )

    const p = {
      ns: Router.getNS(req),
      v: Router.getQuery(req).v,
    }
    core.mergeClientCoverage(body, p)
    core.createCoverage(p)
    res.json({
      ok: true,
    })
  })

  return app
}
