/*
 Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import archiver from 'archiver'
import fs from 'fs-extra'
import path from 'node:path'
import { type CoveragePath } from './core'

export async function writeZip(zipName: string, coveragePath: CoveragePath) {
  return new Promise<boolean>((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: {
        level: 9,
      }, // Sets the compression level.
    })
    const baseDir = path.join(process.cwd(), `coverage/${coveragePath.ns}/${coveragePath.v}`)

    if (fs.existsSync(zipName)) {
      fs.rmSync(zipName, { recursive: true })
    }
    fs.ensureFileSync(zipName)
    const output = fs.createWriteStream(zipName)
    archive.on('warning', (err) => {
      reject(err)
    })
    archive.on('error', async (err) => {
      reject(err)
    })
    output.on('close', () => {
      resolve(true)
    })
    archive.pipe(output)
    archive.directory(baseDir, '/').finalize()
  })
}
