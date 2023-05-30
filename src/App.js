import React, { Suspense } from 'react'
import { NhostClient, NhostReactProvider } from '@nhost/react'
import { NhostApolloProvider } from '@nhost/react-apollo'

export const nhost = new NhostClient({
  backendUrl: "https://afffizpkmbpnaltsfgdp.nhost.run",
  clientStorageType: "localStorage",
  autoSignIn: true,
  autoRefreshToken: true
})

import Router from './router/Router'

const App = () => {
  return (
    <Suspense fallback={null}>
      <NhostReactProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
      <Router />
      </NhostApolloProvider>
      </NhostReactProvider>
    </Suspense>
  )
}

export default App
