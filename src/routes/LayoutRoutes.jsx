
export const getLinksForRoute = (user, segment) => {
  // Aici adaugi logica pentru a returna link-urile specifice fiecărei rute
  switch (segment) {
    case 'profile':
      return [
        { text: 'Info', path: '/profile/info' },
        { text: 'Skills', path: '/profile/skills' },
      ];
    case '/':
      return [
        { text: 'Dashboard', path: '/' },
      ];
    case 'team-roles':
      return [
        { text: 'Team Roles', path: '/team-roles' },
      ];
    case 'departments':
      return [
        user?.authorities.some(authority => authority.authority === "ORGANISATION_ADMIN") &&
        { text: 'Departments', path: '/departments/admin/all' },
        user?.isDepartmentManager &&
        { text: 'My Department', path: '/departments/myDepartment/' + user?.idDepartment },
      ];
    case 'projects':
      return [
        { text: `${user?.authorities.some(authority => authority.authority === "EMPLOYEE") ? 'My projects' : 'View projects'}`, path: '/projects' },
      ];
    case 'skills':
      return [
        { text: 'Categories', path: '/skills/categories' },
        { text: 'All skills', path: '/skills/all' },
      ];
    case 'teams':
      return [
        { text: 'Teams', path: '/teams' },
      ];
    case 'employees':
      return [
        { text: 'Employees', path: '/employees/all' },
        { text: 'Invitations', path: '/employees/invitations' },
      ];
    case 'proposals':
      return [
        { text: 'Skills', path: '/proposals/skills' },
        { text: 'Assignment', path: '/proposals/assignment' },
        { text: 'Dealocation', path: '/proposals/dealocation' },
      ];
    case 'notifications':
      return [
        { text: 'Notifications', path: '/notifications' },
      ];
    default:
      return [];
  }
};