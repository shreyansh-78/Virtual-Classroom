import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { classesArray } from "../../dummydata";
import formatDatetime from "../../utils/formatDatetime";
import "./style.scss";

const ItemSm = ({ type, index, data, noLink }) => {
  const [status, setStatus] = useState("");

  const history = useHistory();

  useEffect(() => {
    if (type === "schedule" && classesArray[index]) {
      setStatus(classesArray[index].status);
    }
  }, [type, index]);

  if (!data || !Object.keys(data).length) {
    return <div>No data available</div>;
  }

  const {
    _id: itemId,
    title,
    subject,
    poster,
    teachers,
    createdAt: rawCreatedAt,
    day = "today",
    time,
  } = data;

  const createdAt = formatDatetime(rawCreatedAt);

  const handleClick = () => {
    if (status === "ongoing") {
      history.push("/class/join/91c40469-3a0c-4672-8695-9274537e1bbd");
    }
  };

  return (
    <div
      className={`itemSm ${type} ${type === "schedule" ? status : ""}`}
      onClick={noLink ? handleClick : undefined}
    >
      <div className="column1">
        {type === "schedule" ? (
          <div className={`status-indicator ${status}`}></div>
        ) : (
          <p>{createdAt}</p>
        )}
        <h5>{type === "schedule" ? subject?.name || "N/A" : poster?.fullname || "N/A"}</h5>
      </div>
      <div className="column2">
        <h5>{title}</h5>
        <p>{type === "schedule" ? teachers?.[0]?.fullname || "Unknown Teacher" : subject?.name || "N/A"}</p>
      </div>
      {type === "schedule" && (
        <div className="column3">
          <h5>{time}</h5>
          <p>{day}</p>
        </div>
      )}
      <div className="column4">
        {status === "ongoing" ? (
          noLink ? (
            <button>Join</button>
          ) : (
            <Link
              to={{
                pathname: `/class/join/91c40469-3a0c-4672-8695-9274537e1bbd`,
              }}
              className="link"
            >
              <button>Join</button>
            </Link>
          )
        ) : type === "doubt" ? (
          <Link
            to={{
              pathname: `/${type}/${itemId}`,
              itemData: data,
            }}
            className="link"
          >
            <button>View</button>
          </Link>
        ) : (
          <p className={status}>{status?.replace("-", " ")}</p>
        )}
      </div>
    </div>
  );
};

export default ItemSm;
