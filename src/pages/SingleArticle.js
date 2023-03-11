import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import db from "../firebase";
import { Card } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
///////////////////////////////////////////////
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  FaLink,
} from "react-icons/fa";

const SingleArticle = () => {
  const { urlpath } = useParams();
  const [article, setArticle] = useState(null);
  const shareUrl = window.location.href;
  const [copySuccess, setCopySuccess] = useState(false);

  const renderTooltip = (tooltipText) => (
    <Tooltip id="button-tooltip" className="tooltip">
      {tooltipText}
    </Tooltip>
  );
  ///////////////////////////////////////////
  const handleCopyClick = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };
  ////////////////////////////////////////////////////////

  useEffect(() => {
    const q = query(
      collection(db, "articles"),
      where("urlpath", "==", parseInt(urlpath))
    );
    const fetchArticle = async () => {
      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size === 0) {
          console.log("No matching documents.");
        } else {
          querySnapshot.forEach((doc) => {
            setArticle(doc.data());
          });
        }
      } catch (error) {
        console.log("Error getting article: ", error);
      }
    };

    fetchArticle();
  }, [urlpath]);
  ////////////////////////////////////

  return (
    ///////////////////////////////////////////////
    <div className="card-wrapper">
      {article && (
        <Card>
          <Card.Body className="content">
            <h1>{article.title}</h1>
            <div className="share-links">
              <OverlayTrigger
                placement="top"
                overlay={renderTooltip("Share on Facebook")}
              >
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook
                    size={20}
                    className="social-icon"
                    style={{
                      color: "#3B5998",
                    }}
                  />
                </a>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={renderTooltip("Share on Twitter")}
              >
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(
                    article.title
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter
                    size={20}
                    className="social-icon"
                    style={{ color: "#1DA1F2" }}
                  />
                </a>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={renderTooltip("Share on LinkedIn")}
              >
                <a
                  href={`https://www.linkedin.com/shareArticle?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin
                    size={20}
                    className="social-icon"
                    style={{ color: "#0077B5" }}
                  />
                </a>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={renderTooltip("Share on WhatsApp")}
              >
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp
                    size={20}
                    className="social-icon"
                    style={{ color: "#25D366" }}
                  />
                </a>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={renderTooltip("Send via email")}
              >
                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    article.title
                  )}&body=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaEnvelope
                    size={20}
                    className="social-icon"
                    style={{ color: "#f48924" }}
                  />
                </a>
              </OverlayTrigger>

              <OverlayTrigger
                placement="top"
                overlay={renderTooltip(copySuccess ? "URL Copied" : "Copy URL")}
              >
                <a href="#" onClick={handleCopyClick}>
                  <FaLink
                    size={20}
                    className="social-icon"
                    style={{ color: "#6c757d" }}
                  />
                </a>
              </OverlayTrigger>
            </div>
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default SingleArticle;
