'use client'

import type {PropsWithChildren} from 'react';
import {ApolloProvider} from "@apollo/client";
import {client} from "@/libs/apollo-client";

function ApolloClientProvider({children}: PropsWithChildren){
    return <ApolloProvider client={client} children={children}></ApolloProvider>
}

export default ApolloClientProvider;
