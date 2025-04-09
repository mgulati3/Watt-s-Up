/**
 * WattsUpApp.jsx
 *
 * A React application to estimate household energy usage.
 * It allows users to add appliances, calculate their daily energy consumption (in kWh),
 * compare their usage to the U.S. average, and receive energy-saving tips.
 *
 * Features:
 * - Add appliances with configurable power (watts) and daily hours of use.
 * - Display a summary of your energy usage.
 * - Compare your usage to an average U.S. household.
 * - Save and load data from localStorage.
 * - Provide dynamic energy-saving tips.
 *
 * Author: Manan Gulati 
 * Date: 9th May 2025
 */

import React, { useState, useEffect } from 'react';
// Import icons from lucide-react for a modern UI
import { Lightbulb, Trash2, PlusCircle, Save, RefreshCw } from 'lucide-react';

// Constant list of common appliances and their average wattage
const APPLIANCES = [
  { name: 'Refrigerator', watts: 150 },
  { name: 'AC/Heater', watts: 1500 },
  { name: 'Laptop', watts: 50 },
  { name: 'Desktop Computer', watts: 200 },
  { name: 'TV', watts: 100 },
  { name: 'Microwave', watts: 1000 },
  { name: 'Washing Machine', watts: 500 },
  { name: 'Dryer', watts: 3000 },
  { name: 'Light Bulb (LED)', watts: 9 },
  { name: 'Light Bulb (Incandescent)', watts: 60 },
  { name: 'Dishwasher', watts: 1200 },
  { name: 'Electric Oven', watts: 2150 },
  { name: 'Coffee Maker', watts: 1000 },
  { name: 'Toaster', watts: 1100 },
  { name: 'Hair Dryer', watts: 1800 },
  { name: 'Ceiling Fan', watts: 75 },
  { name: 'Router/Modem', watts: 15 },
  { name: 'Gaming Console', watts: 150 },
  { name: 'Phone Charger', watts: 5 },
  { name: 'Other', watts: 0 }
];

// U.S. average daily household electricity consumption in kWh for comparison
const US_AVERAGE_KWH = 30;

// A list of energy-saving tips to show the user
const ENERGY_TIPS = [
  "Replace incandescent bulbs with LED bulbs to save up to 80% energy on lighting.",
  "Unplug devices when not in use to eliminate 'phantom' energy use.",
  "Use smart power strips to automatically cut power to devices in standby mode.",
  "Set your refrigerator temperature to 38°F and freezer to 0°F for optimal efficiency.",
  "Run full loads in dishwashers and washing machines to maximize efficiency.",
  "Use cold water for laundry when possible to save on water heating costs.",
  "Clean or replace AC filters regularly to improve efficiency.",
  "Use ceiling fans to supplement AC and raise the thermostat by 4°F without loss of comfort.",
  "Enable power management settings on computers and monitors.",
  "Air dry dishes and clothes when possible instead of using machine drying."
];

export default function WattsUpApp() {
  // State for list of appliances usage items
  const [usageItems, setUsageItems] = useState([]);

  // States to track form input values for new appliances
  const [newAppliance, setNewAppliance] = useState('Refrigerator');
  const [newWatts, setNewWatts] = useState(150);
  const [newHours, setNewHours] = useState(24);

  // State for total energy consumption (kWh), comparison percentage, and a random energy tip
  const [totalKwh, setTotalKwh] = useState(0);
  const [comparisonPercentage, setComparisonPercentage] = useState(0);
  const [randomTip, setRandomTip] = useState('');

  // State for controlling active tabs in the application (calculator, insights, learn)
  const [activeTab, setActiveTab] = useState('calculator');

  // State to show a "saved" indicator after saving data to localStorage
  const [isSaved, setIsSaved] = useState(false);

  /**
   * useEffect hook - Loads saved usage data from localStorage 
   * and sets a random energy-saving tip when the component mounts.
   */
  useEffect(() => {
    const savedData = localStorage.getItem('wattsUpData');
    if (savedData) {
      setUsageItems(JSON.parse(savedData));
    }
    const randomIndex = Math.floor(Math.random() * ENERGY_TIPS.length);
    setRandomTip(ENERGY_TIPS[randomIndex]);
  }, []);

  /**
   * useEffect hook - Recalculates total energy usage (in kWh)
   * and updates the comparison percentage each time the usageItems array changes.
   */
  useEffect(() => {
    // Calculate total energy consumption in kWh for the day
    const total = usageItems.reduce(
      (sum, item) => sum + (item.watts * item.hours) / 1000,
      0
    );
    setTotalKwh(total);
    // Calculate how the user's energy usage compares to the U.S. average
    setComparisonPercentage((total / US_AVERAGE_KWH) * 100);
    // Reset saved indicator on data change
    setIsSaved(false);
  }, [usageItems]);

  /**
   * Event handler to add a new appliance to the usage list.
   * It prevents the default form submission, creates a new usage item,
   * and resets the hours input field.
   */
  const handleAddAppliance = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(), // Unique identifier based on timestamp
      name: newAppliance,
      watts: parseInt(newWatts, 10),
      hours: parseFloat(newHours),
      kWh: (parseInt(newWatts, 10) * parseFloat(newHours)) / 1000
    };
    setUsageItems([...usageItems, newItem]);
    setNewHours(24); // Reset hours input to default value after adding
  };

  /**
   * Event handler to update appliance selection.
   * It sets the new appliance name and updates its corresponding wattage.
   */
  const handleApplianceChange = (e) => {
    const selected = e.target.value;
    setNewAppliance(selected);
    const appliance = APPLIANCES.find(a => a.name === selected);
    setNewWatts(appliance ? appliance.watts : 0);
  };

  /**
   * Removes a selected appliance from the usage list.
   *
   * @param {number} id - The unique identifier of the appliance to delete.
   */
  const handleDeleteItem = (id) => {
    setUsageItems(usageItems.filter(item => item.id !== id));
  };

  /**
   * Randomly selects and sets a new energy-saving tip.
   */
  const getNewTip = () => {
    const randomIndex = Math.floor(Math.random() * ENERGY_TIPS.length);
    setRandomTip(ENERGY_TIPS[randomIndex]);
  };

  /**
   * Saves the current usage data to localStorage and shows a "saved" indicator.
   */
  const saveData = () => {
    localStorage.setItem('wattsUpData', JSON.stringify(usageItems));
    setIsSaved(true);
    // Hide the "saved" indicator after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  /**
   * Helper function to return a CSS class based on the energy efficiency level.
   * It uses the comparison percentage to determine styling.
   *
   * @returns {string} A string representing Tailwind CSS classes.
   */
  const getEfficiencyClass = () => {
    if (comparisonPercentage <= 50) return "text-green-500";
    if (comparisonPercentage <= 80) return "text-green-400";
    if (comparisonPercentage <= 120) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span role="img" aria-label="battery">🔋</span> Watt's Up?
              </h1>
              <p className="text-blue-100">Smart Energy Usage Estimator</p>
            </div>
            {/* Navigation Tabs */}
            <nav className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('calculator')}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === 'calculator' 
                    ? 'bg-white text-blue-700' 
                    : 'bg-blue-700 text-white hover:bg-blue-600'
                }`}
              >
                Calculator
              </button>
              <button 
                onClick={() => setActiveTab('insights')}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === 'insights' 
                    ? 'bg-white text-blue-700' 
                    : 'bg-blue-700 text-white hover:bg-blue-600'
                }`}
              >
                Insights
              </button>
              <button 
                onClick={() => setActiveTab('learn')}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === 'learn' 
                    ? 'bg-white text-blue-700' 
                    : 'bg-blue-700 text-white hover:bg-blue-600'
                }`}
              >
                Learn
              </button>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <section className="space-y-8">
            {/* Appliance Input Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Add Your Appliances</h2>
                <button 
                  onClick={saveData}
                  className={`flex items-center text-sm px-3 py-1 rounded-lg border transition ${
                    isSaved
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <span className="mr-1">✓</span> Saved
                    </>
                  ) : (
                    <>
                      <Save size={14} className="mr-1" /> Save
                    </>
                  )}
                </button>
              </div>
              <form onSubmit={handleAddAppliance} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Appliance Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Appliance</label>
                    <select 
                      value={newAppliance}
                      onChange={handleApplianceChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    >
                      {APPLIANCES.map(appliance => (
                        <option key={appliance.name} value={appliance.name}>
                          {appliance.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Power Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Power (Watts)</label>
                    <input 
                      type="number" 
                      min="1"
                      value={newWatts}
                      onChange={(e) => setNewWatts(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  {/* Hours Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hours Used Per Day</label>
                    <input 
                      type="number" 
                      min="0.1" 
                      max="24" 
                      step="0.1"
                      value={newHours}
                      onChange={(e) => setNewHours(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-sm"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Add Appliance
                </button>
              </form>
            </div>
            
            {/* Energy Usage List */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Energy Usage</h2>
              {usageItems.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">Add some appliances to see your energy consumption</p>
                  <p className="text-sm text-gray-400 mt-1">Your data will be saved in your browser</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appliance</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Power (W)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours/Day</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Energy (kWh)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {usageItems.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3">{item.name}</td>
                          <td className="px-4 py-3">{item.watts}</td>
                          <td className="px-4 py-3">{item.hours}</td>
                          <td className="px-4 py-3 font-medium">{item.kWh.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <button 
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-500 hover:text-red-700 transition p-1 rounded-full hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-medium">
                        <td colSpan="3" className="px-4 py-3 text-right">Total Daily Energy:</td>
                        <td className="px-4 py-3 text-blue-600">{totalKwh.toFixed(2)} kWh</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <section className="space-y-8">
            {usageItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Comparison Section */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">How You Compare</h2>
                    <div className="flex items-center mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div 
                          className={`h-6 rounded-full ${comparisonPercentage > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(comparisonPercentage, 200)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Your Daily Usage</p>
                        <p className="text-2xl font-bold text-blue-600">{totalKwh.toFixed(2)} kWh</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">U.S. Average</p>
                        <p className="text-2xl font-bold text-gray-600">{US_AVERAGE_KWH} kWh</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className={`font-medium ${getEfficiencyClass()}`}>
                        {comparisonPercentage <= 50 ? (
                          <>
                            <span role="img" aria-label="Excellent">✨</span> Excellent! Your usage is significantly below average.
                          </>
                        ) : comparisonPercentage <= 80 ? (
                          <>
                            <span role="img" aria-label="Good">👍</span> Good! Your usage is below average.
                          </>
                        ) : comparisonPercentage <= 120 ? (
                          <>
                            <span role="img" aria-label="Average">⚖️</span> Your usage is about average.
                          </>
                        ) : (
                          <>
                            <span role="img" aria-label="Warning">⚠️</span> Your usage is above average. Consider energy-saving measures.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Energy Saving Tip Section */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">Energy Saving Tip</h2>
                      <button 
                        onClick={getNewTip}
                        className="flex items-center text-blue-600 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50 transition"
                      >
                        <RefreshCw size={16} className="mr-1" />
                        <span className="text-sm">New Tip</span>
                      </button>
                    </div>
                    <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-100">
                      <div className="flex">
                        <Lightbulb className="text-yellow-500 mr-3 flex-shrink-0 mt-1" size={24} />
                        <p className="text-gray-800">{randomTip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Show message when there is no energy usage data yet
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="py-10">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">No Data Yet</h2>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Add some appliances in the Calculator tab to see insights about your energy usage and get personalized tips.
                  </p>
                  <button 
                    onClick={() => setActiveTab('calculator')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Go to Calculator
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Learn Tab */}
        {activeTab === 'learn' && (
          <section className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Understanding Energy Consumption</h2>
              <div className="space-y-6">
                {/* Kilowatt-Hour Explanation */}
                <div className="bg-blue-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-lg text-blue-800 mb-2">What is a Kilowatt-Hour (kWh)?</h3>
                  <p className="text-gray-700">
                    A kilowatt-hour (kWh) is a unit of energy equal to 1,000 watt-hours. It represents the amount of energy consumed when a 1,000-watt appliance runs for one hour, or when a 100-watt appliance runs for 10 hours.
                  </p>
                  <div className="mt-3 p-3 bg-white rounded border border-blue-100">
                    <p className="font-medium text-blue-700">The Formula:</p>
                    <p className="font-mono mt-1">kWh = (Power in Watts × Hours of Use) ÷ 1,000</p>
                  </div>
                </div>
                {/* Energy Conversion Explanation */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Energy Conversion and Efficiency</h3>
                  <p className="text-gray-600 mb-3">
                    When electrical energy flows into your appliances, it transforms into other forms of energy:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <h4 className="font-medium text-green-800 mb-2">Light Energy</h4>
                      <p className="text-sm text-gray-600">
                        Bulbs convert electricity to light, but incandescent bulbs waste 90% as heat, while LEDs are much more efficient.
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <h4 className="font-medium text-red-800 mb-2">Heat Energy</h4>
                      <p className="text-sm text-gray-600">
                        Heaters, ovens, and toasters convert electricity to heat through electrical resistance.
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <h4 className="font-medium text-purple-800 mb-2">Mechanical Energy</h4>
                      <p className="text-sm text-gray-600">
                        Motors in fans, washers, and refrigerators convert electricity to motion.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Energy Efficiency Explanation */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Why Does Energy Efficiency Matter?</h3>
                  <p className="text-gray-600 mb-3">
                    Energy efficiency reduces environmental impact by decreasing greenhouse gas emissions, conserving non-renewable resources, and reducing pollution.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>Lower greenhouse gas emissions</li>
                    <li>Conservation of non-renewable resources</li>
                    <li>Reduction in pollution</li>
                  </ul>
                  <p className="mt-3 text-gray-600">
                    Every kWh saved means a step towards a cleaner, more sustainable future.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      
      {/* Footer Section */}
      <footer className="mt-8 bg-gray-100 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-lg text-gray-700">
                <span role="img" aria-label="battery">🔋</span> Watt's Up?
              </h3>
              <p className="text-sm text-gray-500">Smart Energy Usage Estimator</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
