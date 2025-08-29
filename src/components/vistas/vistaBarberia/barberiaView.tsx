import React, { useEffect, useState, useContext } from "react";
import { IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonSearchbar, 
  IonIcon, 
  IonNote, 
  IonSkeletonText
} from "@ionic/react";
import { trashBin, locateOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { Local } from "../../interfaces/interfaceProfesional/interfacesProfesional";
import { StorageContext } from "../../contexts/storageContexts"; // Importar el contexto

function BarberiaView() {
  const { storage } = useContext(StorageContext); // Obtener storage del contexto
  const [barberiaLocales, setBarberiaLocales] = useState<Local[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredLocales, setFilteredLocales] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const cargarLocales = async () => {
      if (!storage) return;

      try {
        const localesGuardados: Local[] = (await storage.get("locales")) || [];
        const localesBarberia = localesGuardados.filter(
          (local) => local.tipoLocal === "barberia"
        );
        
        setBarberiaLocales(localesBarberia);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando locales:", error);
        setLoading(false);
      }
    };

    cargarLocales();
  }, [storage]); // Ejecutar cuando storage cambie

  useEffect(() => {
    const filtered = barberiaLocales.filter((local) =>
      local.nombreTienda.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredLocales(filtered);
  }, [searchText, barberiaLocales]);

  const handleSelectLocal = (local: Local) => {
    history.push(`/barberias/${local.id}`);
  };

  return (
    <IonContent className="ion-padding">
      <IonSearchbar
        value={searchText}
        onIonChange={(e) => setSearchText(e.detail.value!)}
        placeholder="Buscar barbería"
        animated
        clearIcon={trashBin}
      />

      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <IonItem key={i}>
            <IonSkeletonText animated style={{ width: '100%' }} />
          </IonItem>
        ))
      ) : (
        <IonList lines="full">
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

      {!loading && filteredLocales.length === 0 && (
        <div className="ion-text-center ion-padding">
          <p>No se encontraron barberías</p>
        </div>
      )}
    </IonContent>
  );
}

export default BarberiaView;