import React from "react";
import styles from "./Input.module.scss";
import PropTypes from "prop-types";
import { MdOutlineCancel } from 'react-icons/md'

const Input = ({
  checked,
  clearable,
  disabled,
  error,
  helper,
  icon,
  id,
  label,
  max,
  min,
  name,
  onBlur,
  onChange,
  onClick,
  onIconClick,
  onIconClear,
  placeholder,
  pattern,
  readOnly,
  ref,
  required,
  title,
  type,
  value,
}) => {
  return (
    <div className={`${styles.containerInput} ${error && styles.error}`}>
      {label ? <label htmlFor={name}>{label}</label> : <p></p>}
      <input
        title={title}
        required={required}
        disabled={disabled}
        value={value}
        id={id}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        onClick={onClick}
        placeholder={placeholder}
        className={error ? styles.inputErr : null}
        type={type}
        pattern={pattern}
        min={min}
        max={max}
        checked={checked}
        readOnly={readOnly}
      />
      {clearable &&
        <span
          onClick={onIconClear}
          className={`${styles.iconX} ${disabled && styles.disabled}`}
        >
          <MdOutlineCancel />
        </span>
      }
      <span
        onClick={onIconClick}
        className={`${styles.icon} ${disabled && styles.disabled}`}
      >
        {icon}
      </span>
      <p className={error ? styles.helperErr : null}>{helper}</p>
    </div>
  );
};

Input.propTypes = {
  checked: PropTypes.bool,
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helper: PropTypes.string,
  icon: PropTypes.node,
  id: PropTypes.string,
  label: PropTypes.string,
  max: PropTypes.string,
  min: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onIconClear: PropTypes.func,
  onIconClick: PropTypes.func,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  title: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
};

Input.defaultProps = {
  checked: false,
  clearable: false,
  disabled: false,
  error: false,
  helper: "",
  icon: null,
  id: "",
  label: "",
  max: '',
  min: '',
  name: "",
  onBlur: () => { },
  onChange: () => { },
  onClick: () => { },
  onIconClear: () => { },
  onIconClick: () => { },
  placeholder: "Placeholder",
  readOnly: false,
  required: false,
  type: "text",  
};

export default Input;
