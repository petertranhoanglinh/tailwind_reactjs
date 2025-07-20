"use client";
import { _initCardBoxModel } from "../../../_models/cardbox.model";
import GridConfigurator from "../../../_components/Table/GridConfigurator";
import { GridConfig } from "../../../_type/types";
import girdService from "../../../_services/gird.service";
import { useEffect, useState } from "react";

export default function MemberSearchPage() {
  const [gridConfigs, setGridConfigs] = useState<GridConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<GridConfig | null>(null);
  const [loading, setLoading] = useState(false);

  // Load existing configurations
  useEffect(() => {
    const loadConfigs = async () => {
      setLoading(true);
      try {
        const configs = await girdService.loadGridConfig();
        setGridConfigs(configs);
      } catch (error) {
        console.error('Error loading configs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadConfigs();
  }, []);

  const handleSave = async (config: GridConfig) => {
    try {
       let data
      if(selectedConfig){
        data = await girdService.createGridConfig(config, selectedConfig.id);
      }else{
         data = await girdService.createGridConfig(config);
      }
      if(data){
        alert("suscess save ok")
      }
      // Refresh the config list after saving
      const updatedConfigs = await girdService.loadGridConfig();
      setGridConfigs(updatedConfigs);
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  const handleConfigSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const configId = e.target.value;
    if (configId === "") {
      setSelectedConfig(null);
      return;
    }
    const config = gridConfigs.find(c => c.id === configId);
    setSelectedConfig(config || null);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <select
          className="w-72 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onChange={handleConfigSelect}
          value={selectedConfig?.id || ""}
          disabled={loading}
        >
          <option value="">Select a configuration to edit</option>
          {gridConfigs.map(config => (
            <option key={config.id} value={config.id}>
              {config.module || `Configuration ${config.id}`}
            </option>
          ))}
        </select>
        
        <button
          onClick={() => setSelectedConfig(null)}
          disabled={!selectedConfig}
          className={`px-4 py-2 rounded-md ${selectedConfig ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          Create New
        </button>
      </div>
      
      <GridConfigurator 
        onSave={handleSave} 
        initialConfig={selectedConfig}
      />
    </div>
  );
}