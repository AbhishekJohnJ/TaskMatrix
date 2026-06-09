import { HiCheckCircle, HiClipboardList, HiViewBoards, HiCalendar, HiLightningBolt, HiShieldCheck } from 'react-icons/hi';

const About = () => {
  const features = [
    {
      icon: HiClipboardList,
      title: 'Task Management',
      description: 'Create, organize, and track tasks with priority levels, due dates, and custom tags for efficient workflow management.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: HiViewBoards,
      title: 'Kanban Board',
      description: 'Visualize your workflow with an intuitive drag-and-drop interface. Move tasks seamlessly between To Do, In Progress, and Done columns.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: HiCalendar,
      title: 'Calendar View',
      description: 'Plan ahead with a comprehensive calendar that displays all your tasks. Click any date to create new tasks and track deadlines effectively.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: HiLightningBolt,
      title: 'Real-Time Updates',
      description: 'Experience instant synchronization across all views. Changes made in one section automatically reflect everywhere for seamless coordination.',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: HiShieldCheck,
      title: 'Smart Filters',
      description: 'Quickly find what you need with advanced filtering by priority, status, tags, and due dates to focus on what matters most.',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: HiCheckCircle,
      title: 'Priority System',
      description: 'Categorize tasks with three priority levels—High, Medium, and Low—with color-coded indicators for quick visual recognition.',
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
          <span className="text-white font-semibold text-sm">ABOUT TASKMATRIX</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Professional Task Management
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          A modern, feature-rich task management platform designed to streamline your productivity 
          and help you accomplish more with intuitive tools and elegant design.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-5`}>
                <Icon className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Key Highlights Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-600 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Why Choose TaskMatrix?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <HiCheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Intuitive Interface
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Clean, modern design with smooth transitions and responsive layouts that work seamlessly across all devices.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <HiCheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Smart Analytics
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Visualize productivity trends with real-time charts and insights to optimize your workflow and track progress.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <HiCheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Collaborative Workspace
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Share tasks, assign responsibilities, and work together with your team in a unified platform.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <HiCheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Multiple Views
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Switch between list, board, and calendar views to manage tasks the way that works best for you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack - Subtle Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap justify-center gap-3 opacity-60">
          {['React', 'Redux Toolkit', 'Tailwind CSS', 'Vite', 'React Router', 'LocalStorage API'].map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
