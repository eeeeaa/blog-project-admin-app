import styles from "../../styles/common/navbar.module.css";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

import { SlHome } from "react-icons/sl";
import { MdOutlineLogin } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";

import { AppContext } from "../../utils/contextProvider";
import { useContext } from "react";
NameLogo.propTypes = {
  title: PropTypes.string,
};

NavItem.propTypes = {
  label: PropTypes.string,
  url: PropTypes.string,
  icon: PropTypes.object,
};

function NameLogo({ title }) {
  const { userProfile } = useContext(AppContext);

  return (
    <div className={styles["blog-logo-layout"]}>
      <h1 className={styles["blog-title"]}>{title}</h1>
      {userProfile.username === undefined ? (
        <div className={styles["user-profile"]}>Not logged in</div>
      ) : (
        <div className={styles["user-profile"]}>
          user: {userProfile.username}
        </div>
      )}
    </div>
  );
}

function NavItem({ url, label, icon = null }) {
  return (
    <Link to={url} className={styles["nav-item"]}>
      <li className={styles["nav-item"]}>
        {icon}
        {label}
      </li>
    </Link>
  );
}

function Logout() {
  const navigate = useNavigate();
  const { removeCookie, setUserProfile } = useContext(AppContext);
  const handleLogout = () => {
    removeCookie("token");
    setUserProfile({});
    navigate("/");
  };
  <li className={styles["nav-item"]} onClick={handleLogout}>
    <IoLogOutOutline />
    Logout
  </li>;
}

function MenuSection() {
  const { cookies, userProfile } = useContext(AppContext);
  return (
    <ul className={styles["nav-menu-list"]}>
      <NavItem url="/" label={"Home"} icon={<SlHome />} />
      <NavItem
        url="/post/create"
        label={"Create post"}
        icon={<IoCreateOutline />}
      />
      {cookies.token === undefined || userProfile.username === undefined ? (
        <NavItem url="/login" label={"Login"} icon={<MdOutlineLogin />} />
      ) : (
        <Logout />
      )}
    </ul>
  );
}

function Menu() {
  return (
    <div className={styles["nav-menu-container"]}>
      <NameLogo title="Blog Admin App" />
      <MenuSection />
    </div>
  );
}

export default function Navbar() {
  return (
    <div className={styles["nav-bar"]}>
      <Menu />
    </div>
  );
}
