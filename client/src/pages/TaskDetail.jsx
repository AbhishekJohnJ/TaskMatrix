import { useParams } from 'react-router-dom';

const TaskDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Task Detail #{id}
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <p className="text-gray-600 dark:text-gray-400">Task details coming soon...</p>
      </div>
    </div>
  );
};

export default TaskDetail;
