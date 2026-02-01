import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { PageLayout } from '@/components/Layout';
import { ListingCard } from '@/components/Cards';
import { Modal, ConfirmModal } from '@/components/Modal';
import { Input, Select, Textarea } from '@/components/Forms';
import { DB } from '@/utils/db';
import { INDUSTRIES, MACHINE_TYPES, compressImage } from '@/utils/helpers';
import type { Listing } from '@/types';

interface MyListingsProps {
  onNavigate: (path: string) => void;
}

export function MyListings({ onNavigate }: MyListingsProps) {
  const { currentUser, canPost } = useAuth();
  const { notify } = useNotification();
  const [showModal, setShowModal] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    machine_type: '',
    industry_category: '',
    capabilities: '',
    location: '',
    availability: 'Available' as 'Available' | 'Unavailable' | 'On Job',
    price_range: '',
    description: ''
  });
  const [, forceUpdate] = useState({});

  const listings = DB.getListings().filter(l => l.user_id === currentUser?.id);

  const openModal = (listing?: Listing) => {
    if (!canPost) {
      notify('Please complete your profile first', 'warning');
      onNavigate('/complete-profile');
      return;
    }
    if (listing) {
      setEditingListing(listing);
      setFormData({
        machine_type: listing.machine_type,
        industry_category: listing.industry_category,
        capabilities: listing.capabilities,
        location: listing.location,
        availability: listing.availability,
        price_range: listing.price_range,
        description: listing.description
      });
      const photos = DB.getPhotos().filter(p => p.listing_id === listing.id);
      setUploadedPhotos(photos.map(p => p.image_url));
    } else {
      setEditingListing(null);
      setFormData({
        machine_type: '',
        industry_category: '',
        capabilities: '',
        location: '',
        availability: 'Available',
        price_range: '',
        description: ''
      });
      setUploadedPhotos([]);
    }
    setShowModal(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        notify('Invalid file type: ' + file.name, 'error');
        continue;
      }
      if (uploadedPhotos.length >= 10) break;
      const compressed = await compressImage(file);
      setUploadedPhotos(prev => [...prev, compressed]);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedPhotos.length === 0 && !editingListing) {
      notify('Please upload at least one photo', 'error');
      return;
    }

    const listings = DB.getListings();
    const photos = DB.getPhotos();
    
    let listingId: string;
    if (editingListing) {
      listingId = editingListing.id;
      const idx = listings.findIndex(l => l.id === listingId);
      if (idx !== -1) {
        listings[idx] = { ...listings[idx], ...formData };
      }
      // Remove old photos
      const newPhotos = photos.filter(p => p.listing_id !== listingId);
      DB.setPhotos(newPhotos);
    } else {
      listingId = DB.generateId();
      listings.push({
        id: listingId,
        user_id: currentUser!.id,
        ...formData,
        created_at: new Date().toISOString()
      });
    }
    DB.setListings(listings);

    // Save photos
    const currentPhotos = DB.getPhotos();
    uploadedPhotos.forEach(url => {
      currentPhotos.push({
        id: DB.generateId(),
        listing_id: listingId,
        image_url: url,
        uploaded_at: new Date().toISOString()
      });
    });
    DB.setPhotos(currentPhotos);

    setShowModal(false);
    notify(editingListing ? 'Listing updated!' : 'Listing created!');
    forceUpdate({});
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const newListings = DB.getListings().filter(l => l.id !== deleteId);
    const newPhotos = DB.getPhotos().filter(p => p.listing_id !== deleteId);
    DB.setListings(newListings);
    DB.setPhotos(newPhotos);
    setDeleteId(null);
    notify('Listing deleted');
    forceUpdate({});
  };

  return (
    <PageLayout title="My Machines & Services" currentPath="/my-listings">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">{listings.length} listing(s)</p>
        <button
          onClick={() => openModal()}
          className="bg-primary hover:bg-amber-600 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          <i className="fas fa-plus mr-2"></i>Add Listing
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map(l => (
          <ListingCard
            key={l.id}
            listing={l}
            showActions
            onEdit={(id) => openModal(listings.find(x => x.id === id))}
            onDelete={(id) => setDeleteId(id)}
          />
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-truck text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No listings yet</h3>
          <p className="text-gray-500 mb-4">Start by adding your machines and services</p>
          <button
            onClick={() => openModal()}
            className="bg-primary hover:bg-amber-600 text-white px-6 py-2 rounded-lg"
          >
            Add Your First Listing
          </button>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{editingListing ? 'Edit' : 'Add'} Machine/Service</h2>
            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Machine Type *</label>
                <Select
                  options={MACHINE_TYPES}
                  placeholder="Select machine type"
                  value={formData.machine_type}
                  onChange={(e) => setFormData({ ...formData, machine_type: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry Category *</label>
                <Select
                  options={INDUSTRIES}
                  placeholder="Select industry"
                  value={formData.industry_category}
                  onChange={(e) => setFormData({ ...formData, industry_category: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capabilities *</label>
              <Input
                type="text"
                placeholder="e.g., 20-ton lifting capacity, GPS equipped"
                value={formData.capabilities}
                onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <Input
                  type="text"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability *</label>
                <Select
                  options={['Available', 'Unavailable', 'On Job']}
                  placeholder="Select availability"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value as 'Available' | 'Unavailable' | 'On Job' })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (optional)</label>
              <Input
                type="text"
                placeholder="e.g., $500-$800/day"
                value={formData.price_range}
                onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Textarea
                placeholder="Detailed description of your machine/service..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photos * (1-10 images)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handlePhotoUpload}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WEBP. Max 10 images.</p>
              <div className="photo-grid mt-3">
                {uploadedPhotos.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} className="w-full h-24 object-cover rounded-lg" alt="" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition text-xs"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 py-3 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-amber-600 text-white py-3 rounded-lg font-medium"
              >
                {editingListing ? 'Update' : 'Create'} Listing
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this listing?"
      />
    </PageLayout>
  );
}
