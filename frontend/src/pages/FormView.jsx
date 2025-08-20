import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function shouldShow(question, answers) {
  if (!question.conditions || question.conditions.length === 0) return true;
  const c = question.conditions[0];
  if (!c.dependsOnFieldId) return true;
  const val = answers[c.dependsOnFieldId];
  if (c.operator === 'equals') return String(val ?? '') === String(c.value ?? '');
  return true;
}

export default function FormView() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [files, setFiles] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/forms/${id}`)
      .then(r => setForm(r.data))
      .catch(() => setError('Failed to load form'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!form) return;
    const init = {};
    for (const q of form.questions) init[q.airtableFieldId] = '';
    setAnswers(init);
  }, [form]);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const fields = {};
      for (const q of form.questions) {
        if (!shouldShow(q, answers)) continue;
        
        if (q.required && !answers[q.airtableFieldId]) {
          setError(`Please fill in the required field: ${q.label}`);
          setSubmitting(false);
          return;
        }
        
        if (q.type === 'attachment') {
          const list = files[q.airtableFieldId] || [];
          if (list.length) {
            const fd = new FormData();
            for (const f of list) fd.append('files', f);
            const up = await axios.post(`${API}/api/upload/attachments`, fd, { withCredentials: true });
            fields[q.airtableFieldName] = up.data.files.map(f => ({ url: f.url }));
          }
        } else if (q.type === 'multi_select') {
          const raw = answers[q.airtableFieldId] || [];
          fields[q.airtableFieldName] = raw;
        } else {
          fields[q.airtableFieldName] = answers[q.airtableFieldId] || '';
        }
      }
      
      await axios.post(`${API}/api/forms/${id}/submit`, { fields });
      setSubmitted(true);
    } catch (e) {
      setError(e.response?.data?.error || 'Submit failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div>Loading form...</div>
    </div>
  );

  if (error && !form) return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ color: '#FF3B30' }}>{error}</div>
    </div>
  );

  if (submitted) return (
    <div style={{ padding: 24, textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ 
        padding: '32px', 
        backgroundColor: '#f0f8ff', 
        borderRadius: '12px', 
        border: '2px solid #007AFF',
        marginBottom: '24px'
      }}>
        <h2 style={{ color: '#007AFF', margin: '0 0 16px 0' }}>✅ Form Submitted Successfully!</h2>
        <p style={{ margin: '0', color: '#666' }}>
          Your response has been saved to Airtable. Thank you for your submission!
        </p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        style={{
          padding: '12px 24px',
          backgroundColor: '#007AFF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Submit Another Response
      </button>
    </div>
  );

  return (
    <div style={{ padding: 24, maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '24px', 
        borderRadius: '12px', 
        marginBottom: '32px',
        border: '1px solid #e9ecef'
      }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#212529' }}>{form.name}</h1>
        <p style={{ margin: '0', color: '#6c757d' }}>
          This form will submit your responses directly to Airtable.
        </p>
      </div>

      {error && (
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#FFE5E5', 
          color: '#D70015', 
          borderRadius: '8px', 
          marginBottom: '24px',
          border: '1px solid #FFB3B3'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '24px' }}>
        {form.questions.map(q => {
          const visible = shouldShow(q, answers);
          if (!visible) return null;
          
          const common = {
            required: q.required,
            value: answers[q.airtableFieldId] || (q.type === 'multi_select' ? [] : ''),
            onChange: e => setAnswers({ ...answers, [q.airtableFieldId]: e.target ? e.target.value : e })
          };

          return (
            <div key={q.airtableFieldId} style={{ 
              border: '1px solid #e9ecef', 
              borderRadius: '8px', 
              padding: '20px',
              backgroundColor: 'white'
            }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                fontSize: '16px'
              }}>
                {q.label}
                {q.required && <span style={{ color: '#FF3B30', marginLeft: '4px' }}>*</span>}
              </label>
              
              {q.type === 'short_text' && (
                <input 
                  {...common} 
                  type="text"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              )}
              
              {q.type === 'long_text' && (
                <textarea 
                  {...common} 
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              )}
              
              {q.type === 'single_select' && (
                <select 
                  {...common}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Select an option</option>
                  {(q.options || []).map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              )}
              
              {q.type === 'multi_select' && (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {(q.options || []).map(o => (
                    <label key={o} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: (answers[q.airtableFieldId] || []).includes(o) ? '#f0f8ff' : 'white'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={(answers[q.airtableFieldId] || []).includes(o)} 
                        onChange={e => {
                          const cur = new Set(answers[q.airtableFieldId] || []);
                          if (e.target.checked) cur.add(o); else cur.delete(o);
                          setAnswers({ ...answers, [q.airtableFieldId]: Array.from(cur) });
                        }}
                      /> 
                      {o}
                    </label>
                  ))}
                </div>
              )}
              
              {q.type === 'attachment' && (
                <div>
                  <input 
                    type="file" 
                    multiple 
                    onChange={e => setFiles({ ...files, [q.airtableFieldId]: Array.from(e.target.files || []) })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '6px'
                    }}
                  />
                  {files[q.airtableFieldId]?.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <small style={{ color: '#666' }}>Selected files:</small>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                        {files[q.airtableFieldId].map((file, idx) => (
                          <span key={idx} style={{ 
                            padding: '4px 8px', 
                            backgroundColor: '#e9ecef', 
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}>
                            {file.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button 
            type="submit" 
            disabled={submitting}
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              backgroundColor: '#34C759',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Form'}
          </button>
        </div>
      </form>
    </div>
  );
}


