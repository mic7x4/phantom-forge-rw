/* eslint-disable */

// @ts-nocheck

import { Route as rootRouteImport } from './routes/__root'
import { Route as CartRouteImport } from './routes/cart'
import { Route as IndexRouteImport } from './routes/index'
import { Route as ProductSlugRouteImport } from './routes/product.$slug'
import { Route as CategorySlugRouteImport } from './routes/category.$slug'
import { Route as CheckoutRouteImport } from './routes/checkout'
import { Route as AdminRouteImport } from './routes/admin'

const CartRoute = CartRouteImport.update({ id: '/cart', path: '/cart', getParentRoute: () => rootRouteImport } as any)
const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any)
const ProductSlugRoute = ProductSlugRouteImport.update({ id: '/product/$slug', path: '/product/$slug', getParentRoute: () => rootRouteImport } as any)
const CategorySlugRoute = CategorySlugRouteImport.update({ id: '/category/$slug', path: '/category/$slug', getParentRoute: () => rootRouteImport } as any)
const CheckoutRoute = CheckoutRouteImport.update({ id: '/checkout', path: '/checkout', getParentRoute: () => rootRouteImport } as any)
const AdminRoute = AdminRouteImport.update({ id: '/admin', path: '/admin', getParentRoute: () => rootRouteImport } as any)

export interface FileRoutesByFullPath { '/': typeof IndexRoute; '/cart': typeof CartRoute; '/checkout': typeof CheckoutRoute; '/admin': typeof AdminRoute; '/category/$slug': typeof CategorySlugRoute; '/product/$slug': typeof ProductSlugRoute }
export interface FileRoutesByTo { '/': typeof IndexRoute; '/cart': typeof CartRoute; '/checkout': typeof CheckoutRoute; '/admin': typeof AdminRoute; '/category/$slug': typeof CategorySlugRoute; '/product/$slug': typeof ProductSlugRoute }
export interface FileRoutesById { __root__: typeof rootRouteImport; '/': typeof IndexRoute; '/cart': typeof CartRoute; '/checkout': typeof CheckoutRoute; '/admin': typeof AdminRoute; '/category/$slug': typeof CategorySlugRoute; '/product/$slug': typeof ProductSlugRoute }
export interface FileRouteTypes { fileRoutesByFullPath: FileRoutesByFullPath; fullPaths: '/' | '/cart' | '/checkout' | '/admin' | '/category/$slug' | '/product/$slug'; fileRoutesByTo: FileRoutesByTo; to: '/' | '/cart' | '/checkout' | '/admin' | '/category/$slug' | '/product/$slug'; id: '__root__' | '/' | '/cart' | '/checkout' | '/admin' | '/category/$slug' | '/product/$slug'; fileRoutesById: FileRoutesById }
export interface RootRouteChildren { IndexRoute: typeof IndexRoute; CartRoute: typeof CartRoute; CheckoutRoute: typeof CheckoutRoute; AdminRoute: typeof AdminRoute; CategorySlugRoute: typeof CategorySlugRoute; ProductSlugRoute: typeof ProductSlugRoute }

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': { id: '/'; path: '/'; fullPath: '/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
    '/cart': { id: '/cart'; path: '/cart'; fullPath: '/cart'; preLoaderRoute: typeof CartRouteImport; parentRoute: typeof rootRouteImport }
    '/checkout': { id: '/checkout'; path: '/checkout'; fullPath: '/checkout'; preLoaderRoute: typeof CheckoutRouteImport; parentRoute: typeof rootRouteImport }
    '/admin': { id: '/admin'; path: '/admin'; fullPath: '/admin'; preLoaderRoute: typeof AdminRouteImport; parentRoute: typeof rootRouteImport }
    '/category/$slug': { id: '/category/$slug'; path: '/category/$slug'; fullPath: '/category/$slug'; preLoaderRoute: typeof CategorySlugRouteImport; parentRoute: typeof rootRouteImport }
    '/product/$slug': { id: '/product/$slug'; path: '/product/$slug'; fullPath: '/product/$slug'; preLoaderRoute: typeof ProductSlugRouteImport; parentRoute: typeof rootRouteImport }
  }
}

const rootRouteChildren: RootRouteChildren = { IndexRoute, CartRoute, CheckoutRoute, AdminRoute, CategorySlugRoute, ProductSlugRoute }
export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>()
