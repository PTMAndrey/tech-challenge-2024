import React from 'react'
import styles from "./Skills.module.scss";
import { useLocation,  } from 'react-router-dom';
import SkillCategories from './Categories/SkillCategories';
import AllSkills from './All/AllSkills';

const Skills = () => {
  const location = useLocation();
  const currentTab = location.pathname.split("/")[2];
  const tabSelector = () => {
    switch (currentTab) {
      case "categories":
        return <SkillCategories />;
      case "all":
        return < AllSkills />;
      default:
        break;
    }
  };
  return (
    <section className={styles.pageSkills}>
      <div className={styles.content}>{tabSelector()}</div>
    </section>

  );
};

export default Skills;