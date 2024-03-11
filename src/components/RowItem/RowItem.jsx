import React from "react";
import styles from "./RowItem.module.scss";

const RowItem = ({ active, disabled, title, info, data, action, onAction, onCancel }) => {
  return (
    <div className={styles.container}>
      <span>
        <h6 className={styles.title}>{title}</h6>
        {info !== null ?
          <p className={styles.info}>{info}</p>
          :
          <>
            {data?.map(role => (
              <p key={role.id} className={styles.info}>{role.authority}</p>
            ))}
          </>
        }
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
