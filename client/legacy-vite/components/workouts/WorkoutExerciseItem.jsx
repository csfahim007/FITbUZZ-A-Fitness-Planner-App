export default function WorkoutExerciseItem({ exerciseItem }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">
          {exerciseItem.exercise?.name || 'Unknown Exercise'}
        </h3>
        <div className="flex space-x-4">
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
            {exerciseItem.sets} sets
          </span>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
            {exerciseItem.reps} reps
          </span>
          {exerciseItem.weight > 0 && (
            <span className="text-sm bg-gray-100 px-2 py-1 rounded">
              {exerciseItem.weight} kg
            </span>
          )}
        </div>
      </div>
      {exerciseItem.exercise?.muscleGroup && (
        <p className="text-sm text-gray-500 capitalize">
          {exerciseItem.exercise.muscleGroup}
        </p>
      )}
    </div>
  );
}