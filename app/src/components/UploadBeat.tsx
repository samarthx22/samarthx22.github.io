import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Upload } from 'lucide-react';

export function UploadBeat() {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const audioFile = (e.target as HTMLFormElement).audio.files[0];
    const fileName = `${Date.now()}-${audioFile.name}`;

    try {
      // Upload audio file
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('beats')
        .upload(fileName, audioFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('beats')
        .getPublicUrl(fileName);

      // Save beat metadata
      const { error: dbError } = await supabase.from('beats').insert({
        title: formData.title,
        audio_url: publicUrl,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (dbError) throw dbError;

      // Reset form
      setFormData({ title: '' });
      (e.target as HTMLFormElement).reset();
      alert('Beat uploaded successfully!');
    } catch (error) {
      console.error('Error uploading beat:', error);
      alert('Error uploading beat');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Upload New Beat</h2>
      <div>
        <label className="block text-sm font-medium text-gray-300">Title</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white p-2"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Audio File</label>
        <input
          type="file"
          name="audio"
          accept="audio/*"
          required
          className="mt-1 block w-full text-white"
        />
      </div>
      <button
        type="submit"
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
      >
        <Upload size={20} />
        {uploading ? 'Uploading...' : 'Upload Beat'}
      </button>
    </form>
  );
}