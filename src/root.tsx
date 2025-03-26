import {Links, Meta, Outlet, Scripts, ScrollRestoration} from 'react-router'
import 'index.css'


export function Layout({children,}:{children: React.ReactNode}){
  return(
    <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/vite.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link href="/assets/css/responsive.css" rel="stylesheet" type="text/css"/>
            <link href="/assets/css/style.css" rel="stylesheet" type="text/css"/>
            <link rel="stylesheet" href="/src/index.css" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" 
            rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous"/>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
            <title>Gestión</title>

        </head>
        <body>
            {children}
            <ScrollRestoration/>
            <Scripts />

        </body>
    </html>
  )
}

export default function Root(){
    return <Outlet/>
}