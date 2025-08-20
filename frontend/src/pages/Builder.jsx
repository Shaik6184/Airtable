import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Builder() {
  const navigate = useNavigate();
  const [bases, setBases] = useState([]);
  const [baseId, setBaseId] = useState('');
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState('');
  const [tableName, setTableName] = useState('');
  const [fields, setFields] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [name, setName] = useState('Untitled Form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/airtable/bases`, { withCredentials: true })
      .then(r => setBases(r.data.bases || []))
      .catch(() => setError('Failed to load bases'));
  }, []);

  useEffect(() => {
    if (!baseId) return;
    setLoading(true);
    axios.get(`${API}/api/airtable/bases/${baseId}/tables`, { withCredentials: true })
      .then(r => setTables(r.data.tables || []))
      .catch(() => setError('Failed to load tables'))
      .finally(() => setLoading(false));
  }, [baseId]);

  useEffect(() => {
    if (!tableId) return;
    const table = tables.find(t => t.id === tableId);
    setTableName(table?.name || '');
    setFields(table?.fields || []);
  }, [tableId, tables]);

  function toggleQuestion(field) {
    const exists = questions.find(q => q.airtableFieldId === field.id);
    if (exists) {
      setQuestions(questions.filter(q => q.airtableFieldId !== field.id));
    } else {
      const typeMap = { 
        singleLineText: 'short_text', 
        multilineText: 'long_text', 
        singleSelect: 'single_select', 
        multipleSelects: 'multi_select', 
        multipleAttachments: 'attachment' 
      };
      const mapped = typeMap[field.type];
      if (!mapped) return;
      setQuestions([
        ...questions,
        { 
          airtableFieldId: field.id, 
          airtableFieldName: field.name, 
          label: field.name, 
          type: mapped, 
          required: false, 
          options: (field?.options?.choices || []).map(c => c.name), 
          conditions: [] 
        }
      ]);
    }
  }

  async function saveForm() {
    if (!name.trim()) {
      setError('Please enter a form name');
      return;
    }
    if (!baseId || !tableId) {
      setError('Please select a base and table');
      return;
    }
    if (questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const payload = { name, airtable: { baseId, tableId, tableName }, questions };
      const { data } = await axios.post(`${API}/api/forms`, payload, { withCredentials: true });
      navigate(`/form/${data._id}`);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to save form');
    } finally {
      setLoading(false);
    }
  }

  const supportedFields = fields.filter(f => 
    ['singleLineText','multilineText','singleSelect','multipleSelects','multipleAttachments'].includes(f.type)
  );

  return (
    <div style={{ padding: 24, maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>Form Builder</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/dashboard" style={{
            padding: '8px 16px',
            backgroundColor: '#666',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            display: 'inline-block'
          }}>
            ← Dashboard
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#FFE5E5', 
          color: '#D70015', 
          borderRadius: '6px', 
          marginBottom: '16px',
          border: '1px solid #FFB3B3'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: '24px' }}>
        {/* Form Basic Info */}
        <div style={{ 
          border: '1px solid #eee', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Form Details</h3>
          <input 
            placeholder="Enter form name" 
            value={name} 
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>

        {/* Airtable Selection */}
        <div style={{ 
          border: '1px solid #eee', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Airtable Configuration</h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Base</label>
              <select 
                value={baseId} 
                onChange={e => setBaseId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              >
                <option value="">Select base</option>
                {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            {!!tables.length && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Table</label>
                <select 
                  value={tableId} 
                  onChange={e => setTableId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Select table</option>
                  {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Field Selection */}
        {!!fields.length && (
          <div style={{ 
            border: '1px solid #eee', 
            borderRadius: '8px', 
            padding: '20px',
            backgroundColor: '#fafafa'
          }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Available Fields</h3>
            <p style={{ margin: '0 0 16px 0', color: '#666' }}>
              Select the fields you want to include in your form:
            </p>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {supportedFields.map(f => {
                const checked = !!questions.find(q => q.airtableFieldId === f.id);
                return (
                  <div key={f.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '12px',
                    border: '1px solid #eee',
                    borderRadius: '6px',
                    backgroundColor: checked ? '#f0f8ff' : 'white'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={checked} 
                      onChange={() => toggleQuestion(f)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <div>
                      <span style={{ fontWeight: '500' }}>{f.name}</span>
                      <small style={{ opacity: 0.7, marginLeft: '8px' }}>({f.type})</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Questions Configuration */}
        {!!questions.length && (
          <div style={{ 
            border: '1px solid #eee', 
            borderRadius: '8px', 
            padding: '20px',
            backgroundColor: '#fafafa'
          }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Form Questions</h3>
            <p style={{ margin: '0 0 16px 0', color: '#666' }}>
              Customize your form questions:
            </p>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {questions.map((q, idx) => (
                <div key={q.airtableFieldId} style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '16px',
                  backgroundColor: 'white'
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                    <input 
                      value={q.label} 
                      onChange={e => {
                        const next = [...questions];
                        next[idx] = { ...q, label: e.target.value };
                        setQuestions(next);
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input 
                        type="checkbox" 
                        checked={q.required} 
                        onChange={e => {
                          const next = [...questions];
                          next[idx] = { ...q, required: e.target.checked };
                          setQuestions(next);
                        }}
                      /> 
                      Required
                    </label>
                    <button 
                      onClick={() => setQuestions(questions.filter(qq => qq.airtableFieldId !== q.airtableFieldId))}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#FF3B30',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  
                  {['single_select','multi_select'].includes(q.type) && (
                    <div style={{ marginBottom: '12px' }}>
                      <small style={{ display: 'block', marginBottom: '8px', color: '#666' }}>Options:</small>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(q.options || []).map(opt => (
                          <span key={opt} style={{ 
                            border: '1px solid #ddd', 
                            padding: '4px 8px', 
                            borderRadius: '4px',
                            backgroundColor: '#f8f9fa'
                          }}>
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <details>
                    <summary style={{ cursor: 'pointer', color: '#007AFF' }}>
                      Conditional Logic
                    </summary>
                    <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
                      Show this question only if a previous question equals a specific value.
                    </small>
                    <div style={{ display: 'grid', gap: '8px', marginTop: '12px' }}>
                      <select 
                        value={q?.conditions?.[0]?.dependsOnFieldId || ''} 
                        onChange={e => {
                          const next = [...questions];
                          const cond = { ...(q.conditions?.[0] || {}), dependsOnFieldId: e.target.value, operator: 'equals', value: '' };
                          next[idx] = { ...q, conditions: [cond] };
                          setQuestions(next);
                        }}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      >
                        <option value="">No conditions</option>
                        {questions.filter(qq => qq.airtableFieldId !== q.airtableFieldId).map(qq => (
                          <option key={qq.airtableFieldId} value={qq.airtableFieldId}>
                            {qq.label}
                          </option>
                        ))}
                      </select>
                      <input 
                        placeholder="Value to match" 
                        value={q?.conditions?.[0]?.value || ''} 
                        onChange={e => {
                          const next = [...questions];
                          const cond = { ...(q.conditions?.[0] || {}), value: e.target.value, operator: 'equals' };
                          next[idx] = { ...q, conditions: [cond] };
                          setQuestions(next);
                        }}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </details>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button 
                onClick={saveForm} 
                disabled={!baseId || !tableId || !questions.length || loading}
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  backgroundColor: '#34C759',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Saving...' : 'Save Form'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


