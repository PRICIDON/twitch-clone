import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import { SERVER_URL } from '@/libs/constants/url.constants'

const httpLink = createUploadLink({
    uri:SERVER_URL,
    credentials: 'include',
    headers: {
        "apollo-require-preflight": 'true'
    }
})
export const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
})
