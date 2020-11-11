import React from "react";

function ShowDetail() {
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div className="loader center">
      <i className="fa fa-cog fa-spin fa-5x" />
    </div>
  );
}

export default ShowDetail;