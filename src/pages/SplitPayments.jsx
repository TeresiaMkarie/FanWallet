import { useState } from "react";
import { Plus, Users, X, Check } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import { TopBar } from "../components/layout/TopBar";
import { uid, fmtUSDT } from "../lib/format";

export function SplitPayments({ state, setState, addTx, toast }) {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [total, setTotal] = useState("");
  const [members, setMembers] = useState(["You", ""]);

  const addMemberField = () => setMembers((m) => [...m, ""]);
  const updateMember = (i, v) => setMembers((m) => m.map((x, idx) => (idx === i ? v : x)));
  const removeMember = (i) => setMembers((m) => m.filter((_, idx) => idx !== i));

  const create = () => {
    const validMembers = members.map((m) => m.trim()).filter(Boolean);
    const t = parseFloat(total) || 0;
    if (!title || t <= 0 || validMembers.length < 2) { toast("Add a title, total, and at least two people.", "error"); return; }
    const share = +(t / validMembers.length).toFixed(2);
    const group = {
      id: uid(), title, total: t, createdAt: Date.now(),
      members: validMembers.map((name, i) => ({ name, share, paid: i === 0 })),
    };
    setState((s) => ({ ...s, splitGroups: [group, ...s.splitGroups] }));
    setCreating(false); setTitle(""); setTotal(""); setMembers(["You", ""]);
    toast("Split group created.");
  };

  const markPaid = (groupId, idx) => {
    setState((s) => ({
      ...s,
      splitGroups: s.splitGroups.map((g) => g.id === groupId
        ? { ...g, members: g.members.map((m, i) => i === idx ? { ...m, paid: true } : m) }
        : g),
    }));
    const group = state.splitGroups.find((g) => g.id === groupId);
    if (group) {
      addTx({ type: "split", amount: group.members[idx].share, title: `Split · ${group.title} (${group.members[idx].name})`, status: "completed" });
    }
    toast("Marked as paid.");
  };

  return (
    <div className="fw-fade-in">
      <TopBar title="Split Payments" subtitle="Divide watch-party costs across the group, fairly." right={
        <button className="fw-btn fw-btn-primary fw-focus" onClick={() => setCreating(true)}><Plus size={15} /> New split</button>
      } />

      {state.splitGroups.length === 0 ? (
        <Card style={{ padding: 0 }}><EmptyState icon={Users} title="No split groups yet" subtitle="Create one for your next watch party." action={<button className="fw-btn fw-btn-primary fw-focus" onClick={() => setCreating(true)}>Create a split</button>} /></Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
          {state.splitGroups.map((g) => {
            const paidCount = g.members.filter((m) => m.paid).length;
            return (
              <Card key={g.id} style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ fontWeight: 800, fontSize: 14.5 }}>{g.title}</div>
                  <span className="fw-badge fw-badge-gold">{paidCount}/{g.members.length} paid</span>
                </div>
                <div className="fw-mono" style={{ fontSize: 12.5, color: "var(--chalk-dim)", marginBottom: 12 }}>Total {fmtUSDT(g.total)} USD₮ · {fmtUSDT(g.total / g.members.length)} each</div>
                {g.members.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderTop: "1px solid var(--pitch-line)" }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{m.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="fw-mono" style={{ fontSize: 12 }}>{fmtUSDT(m.share)}</span>
                      {m.paid ? <span className="fw-badge fw-badge-green"><Check size={10} /> Paid</span> :
                        <button className="fw-btn fw-btn-ghost fw-btn-sm fw-focus" onClick={() => markPaid(g.id, i)}>Mark paid</button>}
                    </div>
                  </div>
                ))}
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="New split group">
        <Field label="What's this for?">
          <input className="fw-input fw-focus" placeholder="Derby watch party" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Total amount (USD₮)">
          <input className="fw-input fw-focus" type="number" min="0" placeholder="0.00" value={total} onChange={(e) => setTotal(e.target.value)} />
        </Field>
        <Field label="Split between">
          {members.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input className="fw-input fw-focus" placeholder={`Person ${i + 1}`} value={m} onChange={(e) => updateMember(i, e.target.value)} disabled={i === 0} />
              {i > 0 && <button className="fw-btn fw-btn-ghost fw-btn-sm fw-focus" onClick={() => removeMember(i)}><X size={13} /></button>}
            </div>
          ))}
          <button className="fw-btn fw-btn-ghost fw-btn-sm fw-focus" onClick={addMemberField}><Plus size={13} /> Add person</button>
        </Field>
        <button className="fw-btn fw-btn-primary fw-focus" style={{ width: "100%", padding: 12 }} onClick={create}>Create split group</button>
      </Modal>
    </div>
  );
}
