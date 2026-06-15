import { 
  HiCheckCircle, HiClipboardList, HiViewBoards, HiCalendar, 
  HiLightningBolt, HiShieldCheck, HiUserGroup, HiBell, 
  HiChartBar, HiMoon, HiDatabase, HiServer, HiGlobe,
  HiCode, HiCog, HiTrendingUp
} from 'react-icons/hi';
import Logo from '../components/Logo';

const About = () => {
  const coreFeatures = [
    {
      icon: HiClipboardList,
      title: 'Advanced Task Management',
      description: 'Create, organize, and track tasks with comprehensive features including priority levels, due dates, custom tags, descriptions, and status tracking for efficient workflow management.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: HiViewBoards,
      title: 'Interactive Kanban Board',
      description: 'Visualize your workflow with an intuitive drag-and-drop interface. Move tasks seamlessly between To Do, In Progress, and Done columns with real-time synchronization.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: HiUserGroup,
      title: 'Team Collaboration',
      description: 'Create teams, invite members, assign tasks to team members, and manage team workflows. Team leaders can create and distribute tasks, while members can take available tasks.',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: HiCalendar,
      title: 'Calendar Integration',
      description: 'Plan ahead with a comprehensive calendar that displays all your tasks. Click any date to create new tasks and track deadlines effectively with visual indicators.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: HiBell,
      title: 'Real-Time Notifications',
      description: 'Stay updated with instant notifications for task assignments, completions, team activities, and updates. Never miss important changes with our notification system.',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      icon: HiChartBar,
      title: 'Analytics & Insights',
      description: 'Track your productivity with detailed analytics including completion rates, priority distributions, team performance metrics, and task statistics with interactive charts.',
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  const additionalFeatures = [
    {
      icon: HiShieldCheck,
      title: 'Smart Filters & Search',
      description: 'Advanced filtering by priority, status, tags, and due dates. Powerful search across titles, descriptions, and tags.',
    },
    {
      icon: HiLightningBolt,
      title: 'Real-Time Updates',
      description: 'Socket.io integration for instant synchronization across all views and team members in real-time.',
    },
    {
      icon: HiMoon,
      title: 'Dark Mode',
      description: 'Beautiful dark theme with red accent colors for comfortable viewing in any lighting condition.',
    },
    {
      icon: HiTrendingUp,
      title: 'Priority System',
      description: 'Three-level priority system (High, Medium, Low) with color-coded indicators for quick visual recognition.',
    },
    {
      icon: HiCog,
      title: 'User Profiles',
      description: 'Customizable user profiles with profile pictures, personal information, and account settings management.',
    },
    {
      icon: HiGlobe,
      title: 'Responsive Design',
      description: 'Fully responsive interface that works seamlessly on desktop, tablet, and mobile devices.',
    },
  ];

  const teamFeatures = [
    'Create and manage multiple teams',
    'Invite team members via email',
    'Team leader and member role management',
    'Assign tasks to specific team members',
    'Available task pool for members to claim',
    'Team-specific task badges and indicators',
    'Team task completion notifications',
    'Team performance analytics',
  ];

  const techStack = [
    { category: 'Frontend', items: ['React 18', 'Redux Toolkit', 'Tailwind CSS', 'Vite', 'React Router', 'Socket.io Client'] },
    { category: 'Backend', items: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Socket.io', 'JWT Authentication'] },
    { category: 'Features', items: ['Real-time Sync', 'RESTful API', 'Email System', 'File Uploads', 'Activity Logging', 'Rate Limiting'] },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 rounded-3xl shadow-2xl">
            <Logo size={64} />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
          TaskMatrix
        </h1>
        
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Professional Team Task Management Platform
        </p>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          A comprehensive, full-stack task management solution built with modern technologies. 
          Designed for individuals and teams to streamline productivity, collaborate effectively, 
          and accomplish more with powerful features and an elegant user experience.
        </p>
      </div>

      {/* Core Features */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 text-center">
          Core Features
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
          Powerful tools to manage tasks and collaborate with your team
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-black rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 dark:border-red-900 hover:border-red-600 dark:hover:border-red-600 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Features */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-10 text-center">
          Additional Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-red-600 dark:hover:border-red-600 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
                    <Icon className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Collaboration Section */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-black dark:to-black rounded-3xl p-8 md:p-12 border-2 border-red-200 dark:border-red-900 mb-16 dark:shadow-[0_0_20px_rgba(220,38,38,0.3)]">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <HiUserGroup className="text-red-600 dark:text-red-500" size={40} />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Team Collaboration Features
          </h2>
        </div>
        
        <p className="text-center text-gray-700 dark:text-gray-300 mb-8 text-lg max-w-3xl mx-auto">
          Built for teams of all sizes. Collaborate seamlessly with advanced team management and task distribution features.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {teamFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-lg p-4 border border-red-200 dark:border-red-800"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                <HiCheckCircle className="text-white" size={16} />
              </div>
              <span className="text-gray-900 dark:text-white font-medium">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-black dark:to-black rounded-3xl p-8 md:p-12 border-2 border-blue-200 dark:border-blue-900 mb-16 dark:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Why Choose TaskMatrix?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <HiCheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                Full-Stack Solution
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Complete MERN stack application with MongoDB database, Express backend, React frontend, and Node.js server for robust performance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <HiCheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                Real-Time Collaboration
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Socket.io integration ensures instant updates across all team members with live notifications and synchronization.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <HiCheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                Team Collaboration Efficient
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Built-in team management, task assignment, and real-time collaboration features that streamline teamwork and boost productivity across all team members.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <HiCheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                Modern UI/UX
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Beautiful, responsive interface built with Tailwind CSS, featuring dark mode and smooth transitions for optimal user experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-12 shadow-2xl mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-red-100 text-lg mb-6 max-w-2xl mx-auto">
            Join TaskMatrix today and experience the power of professional task management with your team.
          </p>
        </div>

        {/* Technology Stack - Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Built with</p>
          <div className="flex flex-wrap justify-center gap-2 opacity-50">
            {['React', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'Redux Toolkit', 'Tailwind CSS', 'Socket.io', 'JWT', 'Vite'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded text-gray-600 dark:text-gray-400 text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
