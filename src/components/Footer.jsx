const Footer = () => {
  return (
    <footer>
      <p id="logo">
            <big>
                <i className="fa-solid fa-globe" />
            </big>{" "}
            World News - haytam hadad
      </p>
      <p>&copy; {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;
