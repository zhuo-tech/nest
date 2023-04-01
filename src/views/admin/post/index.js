export const tableOption = {
    'border': true,
    'index': true,
    'indexLabel': '序号',
    'stripe': true,
    'addBtn': false,
    'menuAlign': 'center',
    'align': 'center',
    'searchMenuSpan': 6,
    'column': [
        {
            'type': 'input',
            'label': '岗位名称',
            'prop': 'postName',
            span: 24,
            rules: [{
                required: true,
                message: '请输入岗位名称',
                trigger: 'blur'
            }]
        },
        {
            'type': 'input',
            'label': '岗位标识',
            'prop': 'postCode',
            span: 24,
            rules: [{
                required: true,
                message: '请输入岗位标识',
                trigger: 'blur'
            }]
        },
        {
            'type': 'textarea',
            'label': '岗位描述',
            'prop': 'remark',
            'hide': true,
            span: 24
        },
        {
            'type': 'input-number',
            'label': '岗位排序',
            'prop': 'postSort',
            'hide': true,
            span: 6
        },
        {
            'type': 'input',
            'label': '创建时间',
            'prop': 'createTime',
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            'addDisplay': false,
            'editDisplay': false,
            span: 24
        }
    ]
}
