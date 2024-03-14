
export const getLinksForRoute = (user, segment) => {
    // Aici adaugi logica pentru a returna link-urile specifice fiecărei rute
    switch (segment) {
      case 'profile':
        return [
          { text: 'Info', path: '/profile/info' },
          { text: 'Skills', path: '/profile/skills' },
        ];
        case 'dashboard':
        return [
          { text: 'Dashboard', path: '/dashboard' },
        ];
      case 'team-roles':
        return [
          { text: 'Team Roles', path: '/team-roles' },
        ];
      case 'departments':
        return [
          { text: 'Departments', path: '/departments' },
        ];
        case 'projects':
          return [
            { text: `${user?.authorities.some(authority => authority.authority === "EMPLOYEE")? 'My projects' : 'View projects'}`, path: '/projects' },
            { text: `${user?.authorities.some(authority => authority.authority === "EMPLOYEE")? 'My past projects' : 'View past projects'}`, path: '/projects/past-projects' },
          ];
          case 'skills':
            return [
              { text: 'Skills', path: '/skills' },
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