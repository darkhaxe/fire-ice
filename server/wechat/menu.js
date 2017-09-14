// 菜单
export default {
    button: [
        {
            'name': '',
            'sub_button': [{
                'name': '小程序',
                'type': 'click',
                'key': 'mini_clicked'
            },
                {
                    'name': 'test',
                    'type': 'click',
                    'key': 'contact'
                },
                {
                    'name': '手办',
                    'type': 'click',
                    'key': 'gift'
                }]
        },
        {
            'name': '',
            'sub_button': [{
                'name': '冰火家族',
                'type': 'view',
                'key': 'http://coding.immoc.com'
            },
                {
                    'name': '最新资源',
                    'type': 'location_select',
                    'key': 'contact'
                }]
        }

    ]
}
