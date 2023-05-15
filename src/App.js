import React, { Suspense } from 'react'
import { NhostClient, NhostReactProvider } from '@nhost/react'
import { NhostApolloProvider } from '@nhost/react-apollo'

// export const nhost = new NhostClient({
//   subdomain: "localhost:1337",
//   // subdomain: "wyoscpvvnquovtrclbwb",
//   // region: "ap-south-1",
//   refreshIntervalTime : 600,
//   autoRefreshToken: true,
//   autoSignIn: true
// })

export const nhost = new NhostClient({
    // backendUrl: "http://192.168.127.66:1337",
  backendUrl: "https://afffizpkmbpnaltsfgdp.nhost.run",
  // backendUrl: "https://9a08-2407-aa80-15-4097-2590-d913-52df-a5a8.in.ngrok.io",
  clientStorageType: "localStorage",
  autoSignIn: true,
  // autoLogin: true,
  autoRefreshToken: true
})

export const sls = "http://45.249.8.201:5010/qs_dev/getLogs"
// export const sls = "http://localhost:5002/qs_dev/getLogs"
// ** Router Import
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
