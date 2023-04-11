import cloud from '@lafjs/cloud'

import { ObjectId } from 'mongodb'
const data_url = 'https://15365402-1fd4-4340-a608-f3b009d224b1.lafyun.com/file/data/sys_region.json'

export async function main(ctx: FunctionContext) {
  const db = cloud.mongo.db
  await db.dropCollection('sys_region')
  await db.collection('sys_region').createIndex({ code: 1 }, { unique: true })

  const data = await loadData()
  for (const item of data) {
    await insertItem(item, 1)
    console.log(`completed: ${item.name}`)
  }
  
  return 'ok'
}

async function loadData() {
  const res = await cloud.fetch(data_url)
  return res.data
}

async function insertItem(item: any, level: number) {
  const db = cloud.mongo.db
  const _data = {
    _id: new ObjectId().toHexString(),
    code: item.id,
    parent: item.parentId,
    label: item.label,
    level
  }
  try {
    const res = await db.collection('sys_region')
      .insertOne(_data)

    console.log(`i.${item.label}`, res.insertedId)
  } catch (error) {
    if (error.code != 11000) {
      throw error
    }
  }

  if (!item.children?.length) {
    return
  }

  // recursively insert children
  for (const sub of item.children) {
    await insertItem(sub, level + 1)
  }

}