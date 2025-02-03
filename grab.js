#!/usr/bin/env node
import { Repo } from '@automerge/automerge-repo'
import { BrowserWebSocketClientAdapter } from '@automerge/automerge-repo-network-websocket'
import { writeFile } from 'fs/promises'

const [,, docId, syncServerUrl] = process.argv

if (!docId || !syncServerUrl) {
  console.error('Usage: save-automerge <docId> <syncServerUrl>')
  process.exit(1)
}

async function saveAutomergeDoc(docId, syncServerUrl) {
  const repo = new Repo({
    network: [new BrowserWebSocketClientAdapter(syncServerUrl)]
  })
  
  const handle = await repo.find(docId)
  console.log(`Exporting document ${docId}...`)
  console.log(handle.state)
  const binary = await repo.export(docId)
  await writeFile(`${docId}.amrg`, binary)
  await repo.shutdown()
}

saveAutomergeDoc(docId, syncServerUrl)
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
