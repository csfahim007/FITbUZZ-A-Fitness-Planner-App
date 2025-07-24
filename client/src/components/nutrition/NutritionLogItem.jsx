import { useState } from 'react';
import { useDeleteNutritionLogMutation, useUpdateNutritionLogMutation } from '../../api/nutritionApi';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function NutritionLogItem({ log }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    food: log.food,
    calories: log.calories,
    protein: log.protein,
    carbs: log.carbs,
    fats: log.fats
  });
  
  const [deleteNutritionLog, { isLoading: isDeleting }] = useDeleteNutritionLogMutation();
  const [updateNutritionLog, { isLoading: isUpdating }] = useUpdateNutritionLogMutation();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this nutrition log?')) {
      try {
        await deleteNutritionLog(log._id).unwrap();
      } catch (error) {
        console.error('Failed to delete nutrition log:', error);
        alert('Failed to delete nutrition log');
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateNutritionLog({
        id: log._id,
        ...editData,
        calories: Number(editData.calories),
        protein: Number(editData.protein),
        carbs: Number(editData.carbs),
        fats: Number(editData.fats)
      }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update nutrition log:', error);
      alert('Failed to update nutrition log');
    }
  };

  const handleCancel = () => {
    setEditData({
      food: log.food,
      calories: log.calories,
      protein: log.protein,
      carbs: log.carbs,
      fats: log.fats
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'food' ? value : value
    }));
  };

  if (isEditing) {
    return (
      <div className="border border-teal-300 rounded-lg p-4 mb-4 bg-teal-50 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-4">
          <input
            type="text"
            name="food"
            value={editData.food}
            onChange={handleChange}
            className="px-3 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white shadow-sm hover:shadow-md transition-all"
            placeholder="Food name"
          />
          <input
            type="number"
            name="calories"
            value={editData.calories}
            onChange={handleChange}
            className="px-3 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white shadow-sm hover:shadow-md transition-all"
            placeholder="Calories"
            min="0"
          />
          <input
            type="number"
            name="protein"
            value={editData.protein}
            onChange={handleChange}
            className="px-3 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white shadow-sm hover:shadow-md transition-all"
            placeholder="Protein (g)"
            step="0.1"
            min="0"
          />
          <input
            type="number"
            name="carbs"
            value={editData.carbs}
            onChange={handleChange}
            className="px-3 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white shadow-sm hover:shadow-md transition-all"
            placeholder="Carbs (g)"
            step="0.1"
            min="0"
          />
          <input
            type="number"
            name="fats"
            value={editData.fats}
            onChange={handleChange}
            className="px-3 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white shadow-sm hover:shadow-md transition-all"
            placeholder="Fats (g)"
            step="0.1"
            min="0"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-md transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="px-4 py-2 text-white bg-teal-500 rounded-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-teal-300 rounded-lg p-4 flex justify-between items-center mb-4 bg-white shadow-md hover:shadow-lg transition-all">
      <div>
        <h3 className="font-semibold text-teal-800">{log.food}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
            {log.calories} kcal
          </span>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
            P: {log.protein.toFixed(1)}g
          </span>
          <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
            C: {log.carbs.toFixed(1)}g
          </span>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
            F: {log.fats.toFixed(1)}g
          </span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={handleEdit}
          className="text-teal-500 hover:text-teal-600 text-sm font-medium px-3 py-1 rounded-full hover:bg-teal-50 transition-all flex items-center"
        >
          <FaEdit className="mr-1" />
          Edit
        </button>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-600 text-sm font-medium px-3 py-1 rounded-full hover:bg-red-50 transition-all flex items-center disabled:opacity-50"
        >
          <FaTrash className="mr-1" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}