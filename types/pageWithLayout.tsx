import { NextPage } from 'next'
import MainLayout from '../layout/LayoutWithTopAndSideNavbar'
import SecondaryLayout from '../layout/LayoutWithTopNavbar'

type PageWithMainLayoutType = NextPage & { layout: typeof MainLayout }

type PageWithPostLayoutType = NextPage & { layout: typeof SecondaryLayout }

type PageWithLayoutType = PageWithMainLayoutType | PageWithPostLayoutType

export default PageWithLayoutType