import React, { useEffect, useState, useContext } from "react";
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonIcon,
  IonSkeletonText,
  IonNote,
  IonText,
} from "@ionic/react";
import { trashBin, locateOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { Local } from "../../interfaces/interfaceProfesional/interfacesProfesional";
import { StorageContext } from "../../contexts/storageContexts";

function ManicureView() {
  const { storage } = useContext(StorageContext);
  const [manicuresLocales, setManicuresLocales] = useState<Local[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredLocales, setFilteredLocales] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    const cargarLocales = async () => {
      if (!storage) return;

      try {
        const localesGuardados: Local[] = (await storage.get("locales")) || [];
        const localesManicure = localesGuardados.filter(
          (local) => local.tipoLocal === "manicure"
        );

        setManicuresLocales(localesManicure);
        setError("");
      } catch (err) {
        console.error("Error cargando locales de tattoo:", err);
        setError("Error al cargar estudios de tatuaje");
      } finally {
        setLoading(false);
      }
    };
    cargarLocales();
  }, [storage]);

  useEffect(() => {
    const filtered = manicuresLocales.filter((local) =>
      local.nombreTienda.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredLocales(filtered);
  }, [searchText, manicuresLocales]);

  const handleSelectLocal = (local: Local) => {
    history.push(`/manicure/${local.id}`);
  };

  return (
    <IonContent className="ion-padding">
      <IonSearchbar
        value={searchText}
        onIonChange={(e) => setSearchText(e.detail.value!)}
        placeholder="Busca la tienda de tatto"
        animated
        clearIcon={trashBin}
      />

      {loading &&
        Array.from({ length: 5 }).map((_, i) => (
          <IonItem key={i}>
            <IonSkeletonText animated style={{ width: "100%" }} />
          </IonItem>
        ))}

      {error && (
        <IonItem>
          <IonText color="danger">{error}</IonText>
        </IonItem>
      )}

      {!loading && !error && (
        <IonList>
          {filteredLocales.map((local) => (
            <IonItem
              key={local.id}
              button
              detail
              onClick={() => handleSelectLocal(local)}
            >
              <IonIcon icon={locateOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>{local.nombreTienda}</h2>
                <IonNote>{local.direccion}</IonNote>
                <p>{local.telefonoLocal}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}

      {!loading && !error && filteredLocales.length === 0 && (
        <IonItem>
          <IonText>No se encontraron estudios de tatuaje</IonText>
        </IonItem>
      )}
    </IonContent>
  );
}
export default ManicureView;
