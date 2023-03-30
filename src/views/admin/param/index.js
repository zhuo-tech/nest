import { rule } from '@/util/validateRules'

import { getObj } from '@/service/param'


const validateParam = (rule, value, callback) => {
  getObj(value).then(response => {
    if (window.boxType === 'edit') callback()
    const { data } = response
    if (data !== null) {
      callback(new Error('参数键已经存在'))
    } else {
      callback()
    }
  })
}

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan: 6,
  column: [
    {
      label: '名称',
      search: true,
      prop: 'publicName',
      rules: [
        { required: true, message: '请输名称', trigger: 'blur' },
        { max: 30, message: '长度在 30 个字符', trigger: 'blur' },
        { validator: rule.validatorNameCn, trigger: 'blur' }
      ]
    },
    {
      label: '键',
      prop: 'publicKey',
      rules: [
        { required: true, message: '请输入键', trigger: 'blur' },
        { validator: rule.validatorKey, trigger: 'blur' },
        { validator: validateParam, trigger: 'blur' }
      ]
    },
    {
      label: '值',
      overHidden: true,
      prop: 'publicValue',
      rules: [
        { required: true, message: '请输入值', trigger: 'blur' }
      ]
    },
    {
      label: '编码',
      prop: 'validateCode'
    },
    {
      label: '业务类型',
      prop: 'systemFlag',
      type: 'select',
      value: '1',
      dicData: [
        {
          "label": "系统类",
          "value": "1"
        },
        {
          "label": "业务类",
          "value": "0"
        }
      ],
      rules: [{
        required: true,
        message: '请输入类型',
        trigger: 'blur'
      }],
      search: true
    },
    {
      label: '状态',
      prop: 'status',
      type: 'select',
      value: '0',
      dicData: [
        {
          "label": "正常",
          "value": "0"
        },
        {
          "label": "冻结",
          "value": "9"
        }
      ],
      rules: [
        { required: true, message: '请输入值', trigger: 'blur' }
      ]
    },
    {
      label: '参数类型',
      prop: 'publicType',
      type: 'select',
      value: '0',
      dicData: [
        {
          "label": "检索",
          "value": "1"
        },
        {
          "label": "原文",
          "value": "2"
        },
        {
          "label": "报表",
          "value": "3"
        },
        {
          "label": "安全",
          "value": "4"
        },
        {
          "label": "文档",
          "value": "5"
        },
        {
          "label": "消息",
          "value": "6"
        },
        {
          "label": "其他",
          "value": "9"
        },
        {
          "label": "默认",
          "value": "0"
        }
      ],
      rules: [{
        required: true,
        message: '请选择类型',
        trigger: 'blur'
      }]
    }
  ]
}
