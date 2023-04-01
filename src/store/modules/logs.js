import {getStore, setStore} from '@/util/store'
import {dateFormat} from '@/filters/'

const logs = {
    state: {
        logsList: getStore({name: 'logsList'}) || []
    },
    mutations: {
        ADD_LOGS: (state, {type, message, stack, info}) => {
            state.logsList.push(Object.assign({
                id: state.logsList.length,
                url: window.location.href,
                time: dateFormat(new Date())
            }, {
                type,
                message,
                stack,
                info: info.toString()
            }))
            setStore({name: 'logsList', content: state.logsList})
        },
        CLEAR_LOGS: (state) => {
            state.logsList = []
            setStore({name: 'logsList', content: state.logsList})
        }
    }

}

export default logs
