
import { useEffect, useState } from "react";
import cameraLogo from "../logo.svg";
import close from "../close-outline.svg";
import { useNavigate } from "react-router-dom";

function PhotoAlbumPage() {
  const user = localStorage.getItem("username");
  const [pictures, setPictures] = useState([]);

  const navigate = useNavigate();

  async function getAlbum() {
    const reqObj = {
      username: user,
    };
    //hämtar bilder från albumet
    const response = await fetch("http://localhost:2009/api/getalbum", {
      method: "POST",
      body: JSON.stringify(reqObj),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    console.log(data.allImages);
    //lägger in bilderna i state om det är success
    if (data.success === true) {
      setPictures(data.allImages);
    }
  }

  useEffect(() => {
    getAlbum();
  }, []);

  async function deletePhoto(pic: string) {
    const reqObj = {
      user: user,
      img: pic,
    };
    //skickar vald bild till serven och sen tar bort 
    const response = await fetch("http://localhost:2009/api/deletephoto", {
      method: "DELETE",
      body: JSON.stringify(reqObj),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    //hämtar den nya updaterat DB 
    if (data.success === true) {
      getAlbum();
    }
  }

  return (
    <section className="album-container">
      <img
        className="album-logo"
        src={cameraLogo}
        alt=""
        onClick={() => navigate("/CameraPage")}
      />

      {pictures.map((pic: string, i) => (
        <article className="img-article" key={i}>
          <img className="album-img" src={pic}></img>
          <img
            src={close}
            className="remove-btn"
            onClick={() => deletePhoto(pic)}
          ></img>
        </article>
      ))}
    </section>
  );
}

export default PhotoAlbumPage;
