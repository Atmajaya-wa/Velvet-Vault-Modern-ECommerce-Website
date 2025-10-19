import { APP_NAME } from "@/lib/constants";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return ( 
       <footer className="w-full border-t mt-10">
        <div className="p-5 flex-center">
            <p>© {currentYear} {APP_NAME}. All Rights Reserved.</p>
        </div>
       </footer>
     );
}
 
export default Footer;