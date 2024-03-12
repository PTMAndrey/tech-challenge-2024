import React from "react";
import styles from "./RowItem.module.scss";

const RowItem = ({ icon, active, disabled, title, info, action, onAction, onCancel }) => {
  const formatAuthority = (authority) => {
    return authority
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const renderInfo = (info) => {
    if (Array.isArray(info)) {
      return info.map((item) => (
        <p key={item.id} className={styles.info2}>{formatAuthority(item.authority)}</p>
      ));
    } else {
      return <p className={styles.info2}>{info}</p>;
    }
  };

  return (
    <div className={styles.container}>
      <span>
        <h6 className={styles.title}>{icon}{title}</h6>
        {renderInfo(info)}
      </span>

      {active ? (
        <button className={styles.action} onClick={onCancel}>
          Cancel
        </button>
      ) : (
        <button disabled={disabled} className={disabled ? styles.disabled : styles.action} onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
};

export default RowItem;
