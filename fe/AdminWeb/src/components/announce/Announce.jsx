import { useSelector } from "react-redux";
import "./announce.scss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const Announce = () => {
  const { announcement } = useSelector((state) => state.global);
  return (
    <div className="announce">
      {announcement
        .map((item, index) => {
          return (
            <div className="" key={index}>
              <div className="announceContainer">
                <div className="content">
                  <div className={`icon ${item.type}`}>
                    {item.type === "success" ? (
                      <CheckCircleIcon />
                    ) : (
                      <ErrorIcon />
                    )}
                  </div>
                  <span className={`announcement-text ${item.type}`}>
                    {item.message}
                  </span>
                </div>
                <div className={`rainbow-div ${item.type}`} />
              </div>
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default Announce;
