import { ReactNode } from "react";
import Header from "../Component/Header";

interface DefaultLayoutProps {
    children?: ReactNode;  // Make children optional
  }
  
  export const DefaultLayout = ({ children }: DefaultLayoutProps): JSX.Element => {
    return (
      <div>
        <Header />
          <div className="content">{children}</div>  
      </div>
    );
  };
export default DefaultLayout