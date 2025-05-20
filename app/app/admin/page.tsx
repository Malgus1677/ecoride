"use client"
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type User = {
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
  pseudo: string;
  photo: string;
  actif: number
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userInfo, setUserInfo] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    pseudo: "",
    telephone: "",
    date_naissance: "",
  });
  const [adresse, setAdresse] = useState("");
  const [selectedRole] = useState(2); // Employé
  const [photo, setPhoto] = useState<File | null>(null);

  const [covoiturages, setCovoiturages] = useState([]);
  const [credits, setCredits] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/auth");
    const data = await res.json();
    setUsers(data);
  };

  const fetchStats = async () => {
    const res1 = await fetch("http://localhost:5000/api/covoit/covoitpj");
    const data1 = await res1.json();
    console.log("data1", data1)
    setCovoiturages(data1);

    const res2 = await fetch("http://localhost:5000/api/covoit/creditspj");
    const data2 = await res2.json();
    console.log("data2", data2)
    setCredits(data2);

    const res3 = await fetch("http://localhost:5000/api/covoit/creditsTotal");
    const data3 = await res3.json();
    console.log("data3", data3)
    setTotalCredits(data3.total_credits);
  };


  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleAddUser = async () => {
    const formData = new FormData();
    formData.append("userInfo", JSON.stringify(userInfo));
    formData.append("adresse", adresse);
    formData.append("selectedRole", String(selectedRole));
    if (photo) formData.append("imageProfil", photo);

    const res = await fetch("/admin/utilisateur/ajouter", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();

    if (res.ok) {
      alert("Employé ajouté !");
      fetchUsers();
    } else {
      alert(result.message || "Erreur !");
    }
  };

  const suspendUser = async (email: string) => {
    const res = await fetch(`http://localhost:5000/api/auth/suspendre/${email}`, {
      method: "POST",
    });
    const result = await res.json();

    if (res.ok) {
      alert("Utilisateur suspendu !");
      fetchUsers();
    } else {
      alert(result.message || "Erreur !");
    }
  };

  const reactiveUser = async (email: string) => {
    const res = await fetch(`http://localhost:5000/api/auth/reactive/${email}`, {
      method: "POST",
    });
    const result = await res.json();

    if (res.ok) {
      alert("Utilisateur réactivé !");
      fetchUsers();
    } else {
      alert(result.message || "Erreur !");
    }
  };

  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-bold">Espace Administrateur</h1>

      {/* Statistiques */}
      <div className="grid gap-8">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">
            Total des crédits gagnés :
            <span className="text-green-600"> {totalCredits}</span>
          </h3>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Covoiturages par jour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={covoiturages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="nb_covoiturages" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Crédits gagnés par jour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={credits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="credits_gagnes" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ajout d'un employé */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Ajouter un employé</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {["nom", "prenom", "pseudo", "email", "password", "telephone", "date_naissance"].map(
            (field) => (
              <Input
                key={field}
                name={field}
                placeholder={field}
                onChange={handleInputChange}
              />
            )
          )}
          <Input placeholder="Adresse" onChange={(e) => setAdresse(e.target.value)} />
          <input type="file" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
        </div>
        <Button onClick={handleAddUser}>Ajouter</Button>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Utilisateurs & Employés</h2>
        <div className="overflow-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Nom</th>
                <th className="p-2">Prénom</th>
                <th className="p-2">Adresse</th>
                <th className="p-2">Email</th>
                <th className="p-2">Pseudo</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                console.log(u),
                <tr key={i} className="border-t">
                  <td className="p-2">{u.nom}</td>
                  <td className="p-2">{u.prenom}</td>
                  <td className="p-2">{u.adresse}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.pseudo}</td>
                  <td className="p-2">
                    {u.actif === 1 ? (
                      <Button variant="destructive" onClick={() => suspendUser(u.email)}>
                        Suspendre
                      </Button>
                    ) : (
                      <Button variant="default" onClick={() => reactiveUser(u.email)}>
                        Réactiver
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
