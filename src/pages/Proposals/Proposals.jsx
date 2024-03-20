import React, { } from 'react'
import styles from './Proposals.module.scss'
import { useLocation } from 'react-router';
import SkillProposals from './Skills/SkillProposals';

const Proposals = () => {
  const location = useLocation();
  const currentTab = location.pathname.split("/")[2];
  const tabSelector = () => {
    switch (currentTab) {
      case "skills":
        return <SkillProposals />;
      // case "assignment":
      //   return < MyDepartment />;
      //   case "dealocation":
      //     return < MyDepartment />;
      default:
        break;
    }
  };
  return (
    <section className={styles.pageProposals}>
      <div>{tabSelector()}</div>
    </section>

  );
}

export default Proposals;