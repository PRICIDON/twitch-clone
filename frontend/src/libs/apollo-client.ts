import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import { SERVER_URL, WEBSOCKET_URL } from '@/libs/constants/url.constants'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = createUploadLink({
    uri:SERVER_URL,
    credentials: 'include',
    headers: {
        "apollo-require-preflight": 'true'
    }
})

const wsLink = new WebSocketLink({
    uri:WEBSOCKET_URL,
    options:{
        reconnect: true
    }
})

const splitLink = split(({query}) => {
    const definition = getMainDefinition(query)
    return (
        definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    )
}, wsLink, httpLink)

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
})
