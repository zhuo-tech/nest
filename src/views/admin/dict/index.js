import {remote} from '@/service/dict.service.js'

const validateDict = (rule, value, callback) => {
    remote(value).then(response => {
        if (window.boxType === 'edit') {
            return callback()
        }
        const {data} = response
        if (data && data.length !== 0) {
            callback(new Error('同名字典已存在'))
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
    align: 'center',
    refreshBtn: false,
    showClomnuBtn: false,
    searchMenuSpan: 6,
    column: [{
        label: '字典类型',
        span: 24,
        prop: 'dictType',
        search: true,
        editDisabled: true,
        rules: [{
            required: true,
            message: '请输入字典类型',
            trigger: 'blur'
        }, {validator: validateDict, trigger: 'blur'}]
    },
        {
            span: 24,
            label: '所属分类',
            prop: 'systemFlag',
            type: 'select',
            value: '0',
            dicData: [{label: '系统类', value: '1'}, {label: '业务类', value: '0'}],
            rules: [{
                required: true,
                message: '请输入字典类型',
                trigger: 'blur'
            }],
            search: true
        },
        {
            label: '描述',
            prop: 'description',
            type: 'textarea',
            span: 24,
            row: true,
            minRows: 2,
            rules: [{
                required: true,
                message: '请输入字典描述',
                trigger: 'blur'
            }]
        },
        {
            width: 150,
            label: '备注信息',
            prop: 'remarks',
            overHidden: true,
            type: 'textarea',
            span: 24,
            row: true,
            minRows: 2,
            rules: [
                {max: 128, message: '长度在 128 个字符内', trigger: 'blur'}
            ]
        },
        {
            width: 150,
            label: '创建时间',
            prop: 'createTime',
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            'addDisplay': false,
            'editDisplay': false
        }]
}

export const tableDictItemOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    menuAlign: 'center',
    align: 'center',
    refreshBtn: false,
    showClomnuBtn: false,
    searchSize: 'mini',
    column: [{
        label: '类型',
        prop: 'dictType',
        addDisabled: true,
        editDisabled: true
    }, {
        width: 150,
        label: '数据值',
        prop: 'value',
        rules: [{
            required: true,
            message: '请输入数据值',
            trigger: 'blur'
        }]
    }, {
        label: '标签名',
        prop: 'label',
        rules: [{
            required: true,
            message: '请输入标签名',
            trigger: 'blur'
        }]
    }, {
        label: '描述',
        prop: 'description',
        rules: [{
            required: true,
            message: '请输入字典描述',
            trigger: 'blur'
        }]
    }, {
        label: '排序',
        prop: 'sortOrder',
        type: 'number',
        rules: [{
            required: true,
            message: '请输入排序',
            trigger: 'blur'
        }]
    }, {
        label: '备注信息',
        prop: 'remarks'
    }]
}
