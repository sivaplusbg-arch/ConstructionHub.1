export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const timeAgo = (date: string): string => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const compressImage = (file: File, maxWidth = 800): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const INDUSTRIES = [
  'Construction', 'Heavy Machinery', 'Transport & Logistics', 'Earthworks & Excavation',
  'Crane Services', 'Concrete Services', 'Industrial Services', 'Agriculture',
  'Maintenance Services', 'General Contracting', 'Other'
];

export const MACHINE_TYPES = [
  'Excavator', 'Bulldozer', 'Crane (Mobile)', 'Crane (Tower)', 'Backhoe', 'Loader',
  'Dump Truck', 'Concrete Mixer', 'Concrete Pump', 'Forklift', 'Grader', 'Roller',
  'Paver', 'Drilling Rig', 'Generator', 'Compressor', 'Scaffolding', 'Other'
];
