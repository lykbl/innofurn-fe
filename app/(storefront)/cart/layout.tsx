import { useQuery } from '@apollo/client';

const Layout = ({ children }: { children: any }) => {
  // const { data: myCartQuery, loading } = useQuery(CART_QUERY);

  return (
    <div>
      {children}
    </div>
  );
}

export default Layout;
