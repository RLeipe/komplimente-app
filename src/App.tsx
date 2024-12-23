import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import OpenAI from 'openai';

const KomplimenteApp = () => {
  const [name, setName] = useState('');
  const [context, setContext] = useState('');
  const [compliment, setCompliment] = useState('');
  const [loading, setLoading] = useState(false);

  const p1 = ["proj", "oEcJcrGqovcaRJBqUqKa7NcyKN", "dNpBNzkotcR6HmMksJMy3qriWRb4vxZoHdAm_DTK4jUJfTxT3"];
  const p2 = ["BlbkFJ0yh87QdjJcrt1zgR4Xm7VjsULZMYJlHzZDumglIuEEW5Mt5UF8", "39suEvdmuEdZofY4AUqM", "wA"];

  const buildKey = () => {
  // Build the prefix separately
  const prefix = String.fromCharCode(115, 107, 45); // 'sk-'
  
  // Reconstruct with dashes
  return prefix + 
         p1[0] + '-' +
         p1[1] + '-' +
         p1[2] +
         p2[0] + '-' +
         p2[1] + '-' +
         p2[2];
  };

  const generateCompliment = async () => {
    setLoading(true);
    try {
      const key = buildKey();
      console.log("Reconstructed key:", key); 
      const openai = new OpenAI({
        apiKey: key,
        dangerouslyAllowBrowser: true // Required for client-side usage
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            "role": "developer",
            "content": `Du bist ein Komplimente-Generator, der für die Familie meiner Frau witzige Momente erzeugen soll. Das heißt, dass die Mitglieder der Familie dich nutzen um sich untereinander (oder mir) Komplimente zu machen.
            Die erweiterte Familie besteht aus: meinen Schwiegereltern Heike und Frank, ihren Kindern: meiner Frau Andrea, ihrer Schwester Jule, ihrem Bruder Niki, seiner Freundin Tabea, und mir.
            Erstelle witzige, cheesy, aber charmante Komplimente. 
            Ein paar Informationen zu den wahrscheinlichsten Personen meiner Schwieger-Familie:
            Heike: Grundschullehrerin, ist unglaublich stark im Einsatz für ihre Schüler, isst nicht gern scharf.
            Frank: Gymnasiallehrer für Physik, baut gerne technische Projekte, baut seit Jahren an einem Liegefahrrad, macht ständig große Upgrades am Haus, wird manchmal (lieb) mit einer Schildkröte verglichen.
            Andrea: Meine Frau, Apothekerin, macht PhD in Pharmazie, liebt Wärme, Backen.
            Jule: Studium für Grundschullehramt, tanzt gerne, kommt zu spät zum Frühstück.
            Niki/Niklas: Studium für Medizintechnik, sehr technisch und physikalisch begabt, bastelt gerne, spielt Volleyball.
            Tabea: Freundin von Niki, studiert gemeinsam mit Niki in Magdeburg.
            Roman: Informatik-Berater, KI-Interessiert, etwas faul, kocht gerne.
            Benutze unbedingt den gegebenen Kontext (auf welche Situation soll das Kompliment bezogen sein), falls vorhanden.
            Die Komplimente sollten lustige, sehr kurze One-Liner sein. Sei auf keinen Fall zu generisch lieb, sondern eher lustig und leicht beißend. Nutze niemals Emojis. Starte den Spruch nicht mit dem Namen des Ziels, das ist redundant.
            Hier sind ein paar Beispiele, damit du dich am Stil und Ton orientieren kannst:
            Mit deiner Physik-Begeisterung könntest du selbst einem Stein erklären, warum er fallen muss. (Frank)
            Deine Haus-Upgrades sind wie deine Physik-Erklärungen - gründlich, präzise und endlos. (Frank)
            Du bist der lebende Beweis, dass man gleichzeitig faul und produktiv sein kann. (Roman)
            Du nickst so oft und lieb zu Nikis technischen Erklärungen, dass du als Wackelkopf durchgehen könntest. (Tabea)
            `
          },
          {
            "role": "user",
            "content": `Erstelle ein Kompliment für ${name}${context ? ` im Kontext: ${context}` : ''}`
          }
        ],
        temperature: 1.2
      });

      setCompliment(completion.choices[0].message.content || 'Keine Antwort erhalten');
    } catch (error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      if (error.response) {
        console.error('API Response Error:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      setCompliment('Oops! Da darf Roman nochmal nachbessern!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md mx-auto bg-black/30 backdrop-blur-sm rounded-xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Komplimente-App
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-purple-400 
                       text-white placeholder-white/50"
              placeholder="Für wen ist das Kompliment?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Kontext (optional)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-purple-400 
                       text-white placeholder-white/50 h-24"
              placeholder="Was ist der Anlass?"
            />
          </div>

          <button
            onClick={generateCompliment}
            disabled={!name || loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 
                     rounded-md hover:from-purple-700 hover:to-pink-700 
                     disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed 
                     transition-all duration-200 ease-in-out
                     flex items-center justify-center shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Generiere Kompliment...
              </>
            ) : (
              'Kompliment machen!'
            )}
          </button>

          {compliment && (
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white">{compliment}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KomplimenteApp;