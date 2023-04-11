import cloud from '@lafjs/cloud'
import { ObjectId } from 'mongodb'
import * as crypto from 'crypto'

const DB = cloud.database()
const DB_NAME = {
  SYS_MENU: 'sys_menu',
  SYS_ROLE: 'sys_role',
  SYS_USER: 'sys_user',
  SYS_DEPT: 'sys_dept',
  SYS_POST: 'sys_post',
  SYS_ROLE_MENU: 'sys_role_menu',
  SYS_USER_ROLE: 'sys_user_role',
  SYS_USER_POST: 'sys_user_post'
}

export async function main(ctx: FunctionContext) {
  const { data: role } = await DB
    .collection(DB_NAME.SYS_ROLE)
    .where({ roleCode: 'ROLE_ADMIN' })
    .getOne()
  if (role) {
    return '已初始化'
  }
  // init role
  const { id: roleId } = await DB
    .collection(DB_NAME.SYS_ROLE)
    .add(roleObj)
  console.log('create role')

  //init menu
  console.log('menus ->', menus)
  for (const resource of menus) {
    await insertResource(resource, resource.parentId)
    console.log(`completed: ${resource.name}`)
  }
  const { data: resources } = await DB.collection(DB_NAME.SYS_MENU).get()
  if (resources) {
    await insertRoleMenu(roleId, resources)
  }

  //init dept
  console.log('depts ->', depts)
  for (const dept of depts) {
    await insertDept(dept, dept.parentId)
    console.log(`completed: ${dept.name}`)
  }

  //init post
  await DB.collection(DB_NAME.SYS_POST).add(posts, { multi: true })

  // init user
  const { data: org } = await DB.collection(DB_NAME.SYS_DEPT).limit(1).getOne()
  const { id: userId } = await DB.collection(DB_NAME.SYS_USER)
    .add({
      deptId: org._id,
      ...user
    })
  await DB.collection(DB_NAME.SYS_USER_ROLE).add({
    userId,
    roleId
  })
  const { data: postList } = await DB.collection(DB_NAME.SYS_POST).get()
  await insertUserPostByUserId(userId, postList.map((post: Post) => post._id))

  return '初始化完成'
}

async function insertUserPostByUserId(userId: string | number, postIds: string[]) {
  for (const postId of postIds) {
    await DB.collection(DB_NAME.SYS_USER_POST).add({
      userId,
      postId
    })
  }
}

async function insertDept(item: any, parent: string) {
  const db = cloud.mongo.db
  const _data = {
    _id: new ObjectId().toHexString(),
    name: item.name,
    sortOrder: item.sortOrder,
    parentId: parent,
    updateTime: 1679993118089,
    createTime: 1679993118089
  }
  try {
    const res = await db
      .collection(DB_NAME.SYS_DEPT)
      .insertOne(_data)
    console.log(`i.${item.name}`, res.insertedId)
  } catch (error) {
    throw error
  }
  if (!item.children?.length) {
    return
  }
  // insert children
  for (const sub of item.children) {
    await insertDept(sub, _data._id)
  }
}

async function insertRoleMenu(roleId: any, resources: any) {
  const db = cloud.mongo.db
  for (const resource of resources) {
    await db.collection(DB_NAME.SYS_ROLE_MENU).insertOne({
      roleId: roleId,
      menuId: resource._id
    })
  }
}

async function insertResource(item: any, parent: string) {
  const db = cloud.mongo.db
  const _data = {
    _id: new ObjectId().toHexString(),
    name: item.name,
    permission: item.permission,
    path: item.path,
    parentId: parent,
    icon: item.icon,
    sortOrder: item.sortOrder,
    keepAlive: item.keepAlive,
    menuType: item.menuType,
    createBy: 'admin',
    updateBy: 'admin',
    delFlag: item.delFlag,
    label: item.label,
    visible: item.visible,
    updateTime: 1679993118089,
    createTime: 1679993118089
  }
  try {
    const res = await db
      .collection(DB_NAME.SYS_MENU)
      .insertOne(_data)
    console.log(`i.${item.label}`, res.insertedId)
  } catch (error) {
    throw error
  }
  if (!item.children?.length) {
    return
  }
  // insert children
  for (const sub of item.children) {
    await insertResource(sub, _data._id)
  }

}

interface Post {
  _id: string
}

class PasswordTool {
  /**
   * 加密方式映射
   * - key: 加密方式, 保存在密码头中
   * - value: 加密字符串的方法
   */
  private static readonly encryptionMapping = {
    /**
     * 明文: "{none}"
     */
    none: (s: string) => s,
    /**
     * 哈希: "{sha256}"
     */
    sha256: (s: string) => crypto.createHash('sha256').update(s).digest('hex'),
  }
  /**
   * 密码格式: [{加密方式}]<非空字符密文>
   */
  private static readonly encryption = new RegExp('^(\\{([\\dA-Za-z]+)})?(\\S+)$')

  /**
   * 检查密码
   * @param password 客户端提供未加密密码
   * @param ciphertext 数据库保存的加密后的密码
   */
  public static check(password: string, ciphertext: string) {
    const arr = this.encryption.exec(ciphertext)
    // 密码格式不正确
    if (!arr) {
      return false
    }

    const type: keyof typeof PasswordTool.encryptionMapping = (arr[2] ?? 'sha256') as any
    const cipher = arr[3]

    // 如果找不到合适的加密函数, 表达式应为: undefined === cipher
    return this.encryptionMapping[type]?.(password) === cipher
  }

  /**
   * 加密
   */
  public static encrypt(type: keyof typeof PasswordTool.encryptionMapping, password: string) {
    const fun = this.encryptionMapping[type]
    if (!fun) {
      throw new Error('未知类型: ' + type)
    }
    return `{${type}}` + fun?.(password)
  }
}

const posts = [
  {
    "postCode": "CTO",
    "postName": "校长",
    "postSort": 1,
    "remark": "校长",
    "createBy": "admin",
    "updateBy": "admin",
    "delFlag": "0",
    "createTime": "2022-03-26 13:48:17",
    "updateTime": "2022-03-26 13:48:17"
  },
  {
    "postCode": "CI",
    "postName": "运维",
    "postSort": 1,
    "remark": "运维",
    "createBy": "admin",
    "updateBy": "admin",
    "delFlag": "0",
    "createTime": "2022-03-26 13:48:17",
    "updateTime": "2022-03-26 13:48:17"
  }
]

const user = {
  "username": "admin",
  "password": PasswordTool.encrypt('sha256', '111111'),
  "phone": "13645514001",
  "avatar": "",
  "nickname": "薛定谔",
  "name": "laf",
  "idNumber": "341222199690901101",
  "email": "laf@laf.run",
  "createBy": "admin",
  "updateBy": "admin",
  "createTime": "2023-03-14T06:42:43.610Z",
  "updateTime": "2023-03-14T06:42:43.610Z",
  "lockFlag": "0",
  "delFlag": "0"
}

const depts = [
  {
    "_id": "641a66c858e8015dd56c0cb4",
    "name": "人文教育学院",
    "sortOrder": 1,
    "parentId": "0",
    "updateTime": 1680420885611,
    "createTime": 1679488474139,
    "children": [
      {
        "_id": "641a682758e8015dd56c0cb5",
        "name": "健身指导与管理",
        "sortOrder": 1,
        "parentId": "641a66c858e8015dd56c0cb4",
        "updateTime": 1679488459258,
        "createTime": 1679488474139
      },
      {
        "_id": "641a683558e8015dd56c0cb6",
        "name": "酒店管理",
        "sortOrder": 2,
        "parentId": "641a66c858e8015dd56c0cb4",
        "updateTime": 1679488468883,
        "createTime": 1679488474139
      }
    ]
  },
  {
    "_id": "6422bb8658e8015dd56c0e40",
    "name": "经济管理学院",
    "sortOrder": 2,
    "parentId": "0",
    "updateTime": 1679997829952,
    "createTime": 1679997829952,
    "children": [
      {
        "_id": "6422bbd758e8015dd56c0e46",
        "name": "财务管理",
        "sortOrder": 1,
        "parentId": "6422bb8658e8015dd56c0e40",
        "updateTime": 1679997910932,
        "createTime": 1679997910932
      },
      {
        "_id": "6422bbe058e8015dd56c0e47",
        "name": "电子商务",
        "sortOrder": 2,
        "parentId": "6422bb8658e8015dd56c0e40",
        "updateTime": 1679997920795,
        "createTime": 1679997920795
      }
    ]
  },
  {
    "_id": "6422bb9058e8015dd56c0e41",
    "name": "建筑工程系",
    "sortOrder": 3,
    "parentId": "0",
    "updateTime": 1679997840624,
    "createTime": 1679997840624,
    "children": [
      {
        "_id": "6422bbf658e8015dd56c0e48",
        "name": "城市轨道交通运营管理",
        "sortOrder": 1,
        "parentId": "6422bb9058e8015dd56c0e41",
        "updateTime": 1679997942316,
        "createTime": 1679997942316
      },
      {
        "_id": "6422bc0458e8015dd56c0e49",
        "name": "风景园林设计",
        "sortOrder": 2,
        "parentId": "6422bb9058e8015dd56c0e41",
        "updateTime": 1679997956171,
        "createTime": 1679997956171
      }
    ]
  },
  {
    "_id": "6422bb9d58e8015dd56c0e42",
    "name": "电子信息系",
    "sortOrder": 4,
    "parentId": "0",
    "updateTime": 1679997853482,
    "createTime": 1679997853482,
    "children": [
      {
        "_id": "6422bc1458e8015dd56c0e4a",
        "name": "计算机网络技术",
        "sortOrder": 1,
        "parentId": "6422bb9d58e8015dd56c0e42",
        "updateTime": 1679997972404,
        "createTime": 1679997972404
      },
      {
        "_id": "6422bc1d58e8015dd56c0e4b",
        "name": "计算机应用技术",
        "sortOrder": 2,
        "parentId": "6422bb9d58e8015dd56c0e42",
        "updateTime": 1679997981108,
        "createTime": 1679997981108
      }
    ]
  },
  {
    "_id": "6422bbab58e8015dd56c0e43",
    "name": "传媒设计系",
    "sortOrder": 5,
    "parentId": "0",
    "updateTime": 1679997867299,
    "createTime": 1679997867299,
    "children": [
      {
        "_id": "6422bc2c58e8015dd56c0e4c",
        "name": "环境艺术设计",
        "sortOrder": 1,
        "parentId": "6422bbab58e8015dd56c0e43",
        "updateTime": 1679997996244,
        "createTime": 1679997996244
      }
    ]
  },
  {
    "_id": "6422bbb958e8015dd56c0e44",
    "name": "护理学院",
    "sortOrder": 6,
    "parentId": "0",
    "updateTime": 1679997881755,
    "createTime": 1679997881755,
    "children": [
      {
        "_id": "6422bc3958e8015dd56c0e4d",
        "name": "幼教护理",
        "sortOrder": 1,
        "parentId": "6422bbb958e8015dd56c0e44",
        "updateTime": 1679998009612,
        "createTime": 1679998009612
      },
      {
        "_id": "6422bc4358e8015dd56c0e4e",
        "name": "育儿教育",
        "sortOrder": 2,
        "parentId": "6422bbb958e8015dd56c0e44",
        "updateTime": 1679998018860,
        "createTime": 1679998018860
      }
    ]
  },
  {
    "_id": "6422bbc858e8015dd56c0e45",
    "name": "继续教育学院",
    "sortOrder": 7,
    "parentId": "0",
    "updateTime": 1679997895955,
    "createTime": 1679997895955,
    "children": [
      {
        "_id": "6422bc5458e8015dd56c0e4f",
        "name": "工商企业管理",
        "sortOrder": 1,
        "parentId": "6422bbc858e8015dd56c0e45",
        "updateTime": 1679998036772,
        "createTime": 1679998036772
      }
    ]
  }
]

const menus = [
  {
    "_id": "6419767644b04c4b122cd06a",
    "name": "权限管理",
    "permission": "",
    "path": "/admin",
    "parentId": "-1",
    "icon": "icon-miyue",
    "sortOrder": 1,
    "keepAlive": "0",
    "menuType": "0",
    "createBy": "",
    "updateBy": "",
    "delFlag": "0",
    "label": "权限管理",
    "visible": "1",
    "updateTime": 1679495777187,
    "children": [
      {
        "_id": "6419767644b04c4b122cd06d",
        "name": "角色管理",
        "permission": "",
        "path": "/admin/role/index",
        "parentId": "6419767644b04c4b122cd06a",
        "icon": "icon-quanxianguanli",
        "sortOrder": 1,
        "keepAlive": "0",
        "menuType": "0",
        "createBy": "admin",
        "updateBy": "admin",
        "delFlag": "0",
        "label": "角色管理",
        "visible": "1",
        "updateTime": 1679993104743,
        "children": [
          {
            "_id": "6419a1a644b04c4b122cd15a",
            "name": "角色添加",
            "permission": "sys_role_add",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 1,
            "parentId": "6419767644b04c4b122cd06d",
            "createTine": 1679401382038
          },
          {
            "_id": "6419a1be44b04c4b122cd15b",
            "name": "角色编辑",
            "permission": "sys_role_edit",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 2,
            "parentId": "6419767644b04c4b122cd06d",
            "createTine": 1679401406055
          },
          {
            "_id": "6419a1cd44b04c4b122cd15c",
            "name": "角色删除",
            "permission": "sys_role_del",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 3,
            "parentId": "6419767644b04c4b122cd06d",
            "createTine": 1679401421695
          },
          {
            "_id": "641b0d6358e8015dd56c0cd1",
            "label": "资源授权",
            "name": "资源授权",
            "permission": "sys_role_perm",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 4,
            "parentId": "6419767644b04c4b122cd06d",
            "createTine": 1679494499092
          }
        ]
      },
      {
        "_id": "6419767644b04c4b122cd06c",
        "name": "菜单管理",
        "permission": "",
        "path": "/admin/menu/index",
        "parentId": "6419767644b04c4b122cd06a",
        "icon": "icon-caidanguanli",
        "sortOrder": 2,
        "keepAlive": "0",
        "menuType": "0",
        "createBy": "admin",
        "updateBy": "admin",
        "delFlag": "0",
        "label": "菜单管理",
        "visible": "1",
        "updateTime": 1679993111511,
        "children": [
          {
            "_id": "64198ab0dcf3acaa3f7f6a26",
            "name": "菜单新增",
            "permission": "sys_menu_add",
            "path": "",
            "parentId": "6419767644b04c4b122cd06c",
            "icon": "",
            "sortOrder": 1,
            "keepAlive": "0",
            "menuType": "1",
            "createBy": "",
            "updateBy": "",
            "delFlag": "0",
            "visible": "1"
          },
          {
            "_id": "64198ae7dcf3acaa3f7f6a27",
            "name": "菜单编辑",
            "permission": "sys_menu_edit",
            "path": "",
            "parentId": "6419767644b04c4b122cd06c",
            "icon": "",
            "sortOrder": 2,
            "keepAlive": "0",
            "menuType": "1",
            "createBy": "",
            "updateBy": "",
            "delFlag": "0",
            "visible": "1",
            "updateTime": 1679401234157
          },
          {
            "_id": "64198b1ef935bf6395f7a961",
            "name": "菜单删除",
            "permission": "sys_menu_del",
            "path": "",
            "parentId": "6419767644b04c4b122cd06c",
            "icon": "",
            "sortOrder": 3,
            "keepAlive": "0",
            "menuType": "1",
            "createBy": "",
            "updateBy": "",
            "delFlag": "0",
            "visible": "1",
            "updateTime": 1679401240056
          }
        ]
      },
      {
        "_id": "6419767644b04c4b122cd06b",
        "name": "账号管理",
        "permission": "",
        "path": "/admin/user/index",
        "parentId": "6419767644b04c4b122cd06a",
        "icon": "icon-yonghuguanli",
        "sortOrder": 3,
        "keepAlive": "0",
        "menuType": "0",
        "createBy": "",
        "updateBy": "",
        "delFlag": "0",
        "label": "账号管理",
        "visible": "1",
        "updateTime": 1679993118089,
        "children": [
          {
            "_id": "6419767644b04c4b122cd06e",
            "name": "用户新增",
            "permission": "sys_user_add",
            "path": "",
            "parentId": "6419767644b04c4b122cd06b",
            "icon": "",
            "sortOrder": 1,
            "keepAlive": "0",
            "menuType": "1",
            "createBy": "",
            "updateBy": "",
            "delFlag": "0",
            "visible": "1"
          },
          {
            "_id": "6419767644b04c4b122cd06f",
            "name": "用户编辑",
            "permission": "sys_user_edit",
            "path": "",
            "parentId": "6419767644b04c4b122cd06b",
            "icon": "",
            "sortOrder": 2,
            "keepAlive": "0",
            "menuType": "1",
            "createBy": "",
            "updateBy": "",
            "delFlag": "0",
            "visible": "1"
          },
          {
            "_id": "6419767644b04c4b122cd070",
            "name": "用户删除",
            "permission": "sys_user_del",
            "path": "",
            "parentId": "6419767644b04c4b122cd06b",
            "icon": "",
            "sortOrder": 3,
            "keepAlive": "0",
            "menuType": "1",
            "createBy": "",
            "updateBy": "",
            "delFlag": "0",
            "visible": "1"
          },
          {
            "_id": "6419767644b04c4b122cd071",
            "name": "导入导出",
            "permission": "sys_user_export",
            "path": "",
            "parentId": "6419767644b04c4b122cd06b",
            "icon": "",
            "sortOrder": 4,
            "keepAlive": "0",
            "menuType": "1",
            "createBy": "",
            "updateBy": "",
            "delFlag": "0",
            "visible": "1"
          }
        ]
      }
    ]
  },
  {
    "_id": "6422a8e358e8015dd56c0de1",
    "label": "组织机构",
    "name": "组织机构",
    "path": "/dept",
    "icon": "icon-web-icon-",
    "menuType": "0",
    "keepAlive": "0",
    "visible": "1",
    "sortOrder": 2,
    "parentId": "-1",
    "createTine": 1679993058940,
    "children": [
      {
        "_id": "6419a16e44b04c4b122cd159",
        "name": "部门管理",
        "path": "/admin/dept/index",
        "parentId": "6422a8e358e8015dd56c0de1",
        "icon": "icon-canshu",
        "sortOrder": 1,
        "keepAlive": "0",
        "menuType": "0",
        "createBy": "",
        "updateBy": "",
        "delFlag": "0",
        "visible": "1",
        "createTine": 1679401326319,
        "updateTime": 1679993218747,
        "label": "部门管理",
        "children": [
          {
            "_id": "6419a40344b04c4b122cd15d",
            "name": "部门添加",
            "permission": "sys_dept_add",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 1,
            "parentId": "6419a16e44b04c4b122cd159",
            "createTine": 1679401987026
          },
          {
            "_id": "6419a41344b04c4b122cd15e",
            "name": "部门编辑",
            "permission": "sys_dept_edit",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 2,
            "parentId": "6419a16e44b04c4b122cd159",
            "createTine": 1679402003676,
            "updateTime": 1679402015406
          },
          {
            "_id": "6419a43244b04c4b122cd15f",
            "name": "部门删除",
            "permission": "sys_dept_del",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 3,
            "parentId": "6419a16e44b04c4b122cd159",
            "createTine": 1679402034006
          }
        ]
      },
      {
        "_id": "642050f158e8015dd56c0d95",
        "label": "岗位管理",
        "name": "岗位管理",
        "path": "/admin/post/index",
        "icon": "icon-jiaoseguanli",
        "menuType": "0",
        "keepAlive": "0",
        "visible": "1",
        "sortOrder": 2,
        "parentId": "6422a8e358e8015dd56c0de1",
        "createTine": 1679839473113,
        "updateTime": 1679993226427,
        "children": [
          {
            "_id": "6420511c58e8015dd56c0d96",
            "label": "岗位添加",
            "name": "岗位添加",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 1,
            "parentId": "642050f158e8015dd56c0d95",
            "createTine": 1679839516529,
            "permission": "sys_post_add"
          },
          {
            "_id": "6420512b58e8015dd56c0d97",
            "label": "岗位编辑",
            "name": "岗位编辑",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 2,
            "parentId": "642050f158e8015dd56c0d95",
            "createTine": 1679839530966,
            "permission": "sys_post_edit"
          },
          {
            "_id": "6420513b58e8015dd56c0d98",
            "label": "岗位删除",
            "name": "岗位删除",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 3,
            "parentId": "642050f158e8015dd56c0d95",
            "createTine": 1679839546809,
            "permission": "sys_post_del"
          }
        ]
      }
    ]
  },
  {
    "_id": "6422b9cb58e8015dd56c0e11",
    "label": "系统管理",
    "name": "系统管理",
    "path": "/sys",
    "icon": "icon-xitongguanli",
    "menuType": "0",
    "keepAlive": "0",
    "visible": "1",
    "sortOrder": 3,
    "parentId": "-1",
    "createTine": 1679997387158,
    "updateTime": 1680760540494,
    "children": [
      {
        "_id": "64282b7758e8015dd56c0ea0",
        "label": "文件管理",
        "name": "文件管理",
        "path": "/admin/file/index",
        "icon": "icon-caidanguanli",
        "menuType": "0",
        "keepAlive": "0",
        "visible": "1",
        "sortOrder": 1,
        "parentId": "6422b9cb58e8015dd56c0e11",
        "createTine": 1680354167493,
        "children": [
          {
            "_id": "64282b9258e8015dd56c0ea1",
            "label": "文件添加",
            "name": "文件添加",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 1,
            "parentId": "64282b7758e8015dd56c0ea0",
            "createTine": 1680354194103,
            "permission": "sys_file_add"
          },
          {
            "_id": "64282ba358e8015dd56c0ea2",
            "label": "文件编辑",
            "name": "文件编辑",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 2,
            "parentId": "64282b7758e8015dd56c0ea0",
            "createTine": 1680354210752,
            "permission": "sys_file_edit"
          },
          {
            "_id": "64282bb058e8015dd56c0ea3",
            "label": "文件删除",
            "name": "文件删除",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 3,
            "parentId": "64282b7758e8015dd56c0ea0",
            "createTine": 1680354224246,
            "permission": "sys_file_del"
          }
        ]
      },
      {
        "_id": "6428f75a58e8015dd56c0edb",
        "label": "日志管理",
        "name": "日志管理",
        "path": "/admin/log/index",
        "icon": "icon-caidanguanli",
        "menuType": "0",
        "keepAlive": "0",
        "visible": "1",
        "sortOrder": 2,
        "parentId": "6422b9cb58e8015dd56c0e11",
        "createTine": 1680406361991,
        "updateTime": 1680406381632,
        "children": [
          {
            "_id": "6428f78f58e8015dd56c0edc",
            "label": "日志删除",
            "name": "日志删除",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 1,
            "parentId": "6428f75a58e8015dd56c0edb",
            "createTine": 1680406415657,
            "permission": "sys_log_del"
          }
        ]
      },
      {
        "_id": "6422ba1958e8015dd56c0e13",
        "label": "参数管理",
        "name": "参数管理",
        "path": "/admin/param/index",
        "icon": "icon-caidanguanli",
        "menuType": "0",
        "keepAlive": "0",
        "visible": "1",
        "sortOrder": 3,
        "parentId": "6422b9cb58e8015dd56c0e11",
        "createTine": 1679997464966,
        "updateTime": 1680406376205,
        "children": [
          {
            "_id": "6422ba7b58e8015dd56c0e16",
            "label": "参数添加",
            "name": "参数添加",
            "permission": "sys_param_add",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 1,
            "parentId": "6422ba1958e8015dd56c0e13",
            "createTine": 1679997563435
          },
          {
            "_id": "6422ba8858e8015dd56c0e17",
            "label": "参数编辑",
            "name": "参数编辑",
            "permission": "sys_param_edit",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 2,
            "parentId": "6422ba1958e8015dd56c0e13",
            "createTine": 1679997576516
          },
          {
            "_id": "6422ba9558e8015dd56c0e18",
            "label": "参数删除",
            "name": "参数删除",
            "permission": "sys_param_del",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 3,
            "parentId": "6422ba1958e8015dd56c0e13",
            "createTine": 1679997588932
          }
        ]
      },
      {
        "_id": "6422ba3a58e8015dd56c0e14",
        "label": "字典管理",
        "name": "字典管理",
        "path": "/admin/dict/index",
        "icon": "icon-caidanguanli",
        "menuType": "0",
        "keepAlive": "0",
        "visible": "1",
        "sortOrder": 4,
        "parentId": "6422b9cb58e8015dd56c0e11",
        "createTine": 1679997497950,
        "updateTime": 1680406388884,
        "children": [
          {
            "_id": "6422baae58e8015dd56c0e19",
            "label": "字典添加",
            "name": "字典添加",
            "permission": "sys_dict_add",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 1,
            "parentId": "6422ba3a58e8015dd56c0e14",
            "createTine": 1679997614674
          },
          {
            "_id": "6422babd58e8015dd56c0e1a",
            "label": "字典编辑",
            "name": "字典编辑",
            "permission": "sys_dict_edit",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 2,
            "parentId": "6422ba3a58e8015dd56c0e14",
            "createTine": 1679997629586
          },
          {
            "_id": "6422baca58e8015dd56c0e1b",
            "label": "字典删除",
            "name": "字典删除",
            "permission": "sys_dict_del",
            "menuType": "1",
            "keepAlive": "0",
            "visible": "1",
            "sortOrder": 3,
            "parentId": "6422ba3a58e8015dd56c0e14",
            "createTine": 1679997642686
          }
        ]
      }
    ]
  }

]

const roleObj = {
  "roleName": "系统管理员",
  "roleCode": "ROLE_ADMIN",
  "roleDesc": "系统管理员",
  "dsType": 0,
  "dsScope": "",
  "createBy": "admin",
  "createTime": 0,
  "updateBy": "admin",
  "update_time": 0,
  "delFlag": "0"
}