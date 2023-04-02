export const tableOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    menuAlign: 'center',
    menuWidth: 150,
    align: 'center',
    refreshBtn: true,
    searchSize: 'mini',
    searchMenuSpan: 6,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    viewBtn: true,
    props: {
        label: 'label',
        value: 'value'
    },
    column: [
        {
            label: '请求ID',
            prop: 'request_id'
        }, {
            label: '函数',
            prop: 'func'
        },
        {
            label: '数据',
            prop: 'data',
            overHidden: true,
        }, {
            label: '创建时间',
            prop: 'created_at',
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            search: true,
            searchRange: true
        }]
}
