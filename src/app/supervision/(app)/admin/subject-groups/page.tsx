"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubjectGroup {
  id: string;
  name: string;
  vicePrincipalId: string | null;
  _count?: { subjects: number; teachers: number };
}

interface VicePrincipal {
  id: string;
  displayName: string;
}

export default function SubjectGroupsPage() {
  const [groups, setGroups] = useState<SubjectGroup[]>([]);
  const [vps, setVps] = useState<VicePrincipal[]>([]);
  const [form, setForm] = useState({ name: "", vicePrincipalId: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const [gRes, uRes] = await Promise.all([
      fetch("/api/supervision/admin/subject-groups"),
      fetch("/api/supervision/admin/users"),
    ]);
    setGroups(await gRes.json());
    const users = await uRes.json();
    setVps(users.filter((u: { role: string; id: string; displayName: string }) =>
      ["VICE_PRINCIPAL", "VICE_PRINCIPAL_ACADEMIC"].includes(u.role)
    ));
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/supervision/admin/subject-groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: "", vicePrincipalId: "" });
      load();
    } else {
      const d = await res.json();
      setError(d.error);
    }
    setSaving(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">กลุ่มสาระการเรียนรู้</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">เพิ่มกลุ่มสาระ</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>ชื่อกลุ่มสาระ</Label>
              <Input
                placeholder="เช่น ภาษาไทย, คณิตศาสตร์"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>รองผู้อำนวยการผู้รับผิดชอบ</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.vicePrincipalId}
                onChange={(e) => setForm({ ...form, vicePrincipalId: e.target.value })}
              >
                <option value="">— ยังไม่กำหนด —</option>
                {vps.map((vp) => (
                  <option key={vp.id} value={vp.id}>{vp.displayName}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? "กำลังบันทึก..." : "เพิ่มกลุ่มสาระ"}
              </Button>
            </div>
            {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {groups.map((g) => (
          <GroupCard key={g.id} group={g} vps={vps} onUpdate={load} />
        ))}
        {groups.length === 0 && <p className="text-sm text-gray-500">ยังไม่มีกลุ่มสาระ</p>}
      </div>
    </div>
  );
}

function GroupCard({
  group,
  vps,
  onUpdate,
}: {
  group: SubjectGroup;
  vps: VicePrincipal[];
  onUpdate: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [vpId, setVpId] = useState(group.vicePrincipalId || "");
  const [saving, setSaving] = useState(false);

  const vpName = vps.find((v) => v.id === group.vicePrincipalId)?.displayName;

  async function save() {
    setSaving(true);
    await fetch("/api/supervision/admin/subject-groups", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: group.id, vicePrincipalId: vpId }),
    });
    setEditing(false);
    setSaving(false);
    onUpdate();
  }

  return (
    <Card>
      <CardContent className="py-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium">{group.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {group._count?.subjects ?? 0} วิชา · {group._count?.teachers ?? 0} ครู
            </p>
          </div>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <select
                  className="border rounded-md px-2 py-1 text-sm"
                  value={vpId}
                  onChange={(e) => setVpId(e.target.value)}
                >
                  <option value="">— ยังไม่กำหนด —</option>
                  {vps.map((vp) => (
                    <option key={vp.id} value={vp.id}>{vp.displayName}</option>
                  ))}
                </select>
                <Button size="sm" onClick={save} disabled={saving}>{saving ? "..." : "บันทึก"}</Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>ยกเลิก</Button>
              </>
            ) : (
              <>
                <span className={`text-xs px-2 py-1 rounded-full ${vpName ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                  {vpName ?? "ยังไม่กำหนดรองฯ"}
                </span>
                <Button size="sm" variant="outline" onClick={() => { setVpId(group.vicePrincipalId || ""); setEditing(true); }}>
                  แก้ไข
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
